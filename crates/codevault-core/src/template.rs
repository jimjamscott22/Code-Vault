//! Snippet templates: `{{name}}` / `{{name:default}}` placeholders in a
//! snippet's code that get filled in at copy time.
//!
//! Syntax rules (kept identical to `src/lib/template.ts` on the frontend):
//! - A name starts with a letter or `_`, followed by letters, digits, `_` or `-`.
//! - No whitespace inside the braces, so Jinja/Helm-style `{{ var }}` and
//!   GitHub Actions `${{ secrets.X }}` are left alone.
//! - An optional default follows the first `:` and runs up to `}}`; it may not
//!   contain `}` or a newline.
//! - Repeated names are one variable; the first default seen wins.

use std::collections::HashMap;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Placeholder {
    pub name: String,
    pub default: Option<String>,
}

/// One `{{...}}` occurrence: byte range in the source plus its parts.
struct Occurrence<'a> {
    start: usize,
    end: usize,
    name: &'a str,
    default: Option<&'a str>,
}

fn is_name_start(c: char) -> bool {
    c.is_ascii_alphabetic() || c == '_'
}

fn is_name_char(c: char) -> bool {
    c.is_ascii_alphanumeric() || c == '_' || c == '-'
}

fn occurrences(code: &str) -> Vec<Occurrence<'_>> {
    let mut out = Vec::new();
    let mut i = 0;
    while let Some(off) = code[i..].find("{{") {
        let start = i + off;
        let body_start = start + 2;
        if let Some(occ) = parse_at(code, start, body_start) {
            i = occ.end;
            out.push(occ);
        } else {
            i = start + 1;
        }
    }
    out
}

fn parse_at(code: &str, start: usize, body_start: usize) -> Option<Occurrence<'_>> {
    let rest = &code[body_start..];
    if !rest.chars().next().is_some_and(is_name_start) {
        return None;
    }
    let name_end = rest
        .char_indices()
        .find(|&(_, c)| !is_name_char(c))
        .map(|(j, _)| j)
        .unwrap_or(rest.len());
    let name = &rest[..name_end];
    let after = &rest[name_end..];

    if after.starts_with("}}") {
        return Some(Occurrence { start, end: body_start + name_end + 2, name, default: None });
    }
    let def_src = after.strip_prefix(':')?;
    let close = def_src.find("}}")?;
    let default = &def_src[..close];
    if default.contains('}') || default.contains('\n') {
        return None;
    }
    Some(Occurrence {
        start,
        end: body_start + name_end + 1 + close + 2,
        name,
        default: Some(default),
    })
}

/// Distinct placeholders in order of first appearance.
pub fn parse_placeholders(code: &str) -> Vec<Placeholder> {
    let mut seen: Vec<Placeholder> = Vec::new();
    for occ in occurrences(code) {
        if !seen.iter().any(|p| p.name == occ.name) {
            seen.push(Placeholder {
                name: occ.name.to_string(),
                default: occ.default.map(str::to_string),
            });
        }
    }
    seen
}

/// Substitute placeholders. A value in `values` wins; otherwise the
/// placeholder's default is used. Returns the names that had neither.
pub fn render_template(code: &str, values: &HashMap<String, String>) -> Result<String, Vec<String>> {
    let defaults: HashMap<String, Option<String>> = parse_placeholders(code)
        .into_iter()
        .map(|p| (p.name, p.default))
        .collect();

    let mut missing: Vec<String> = Vec::new();
    let mut out = String::with_capacity(code.len());
    let mut last = 0;
    for occ in occurrences(code) {
        out.push_str(&code[last..occ.start]);
        let value = values
            .get(occ.name)
            .cloned()
            .or_else(|| defaults.get(occ.name).cloned().flatten());
        match value {
            Some(v) => out.push_str(&v),
            None => {
                if !missing.iter().any(|m| m == occ.name) {
                    missing.push(occ.name.to_string());
                }
            }
        }
        last = occ.end;
    }
    out.push_str(&code[last..]);

    if missing.is_empty() { Ok(out) } else { Err(missing) }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn vals(pairs: &[(&str, &str)]) -> HashMap<String, String> {
        pairs.iter().map(|(k, v)| (k.to_string(), v.to_string())).collect()
    }

    #[test]
    fn parses_names_and_defaults_in_order() {
        let p = parse_placeholders("docker run -p {{port:8080}}:80 {{image}} {{port}}");
        assert_eq!(
            p,
            vec![
                Placeholder { name: "port".into(), default: Some("8080".into()) },
                Placeholder { name: "image".into(), default: None },
            ]
        );
    }

    #[test]
    fn ignores_non_placeholder_braces() {
        let code = "${{ secrets.TOKEN }} {{ spaced }} {{1bad}} {{}} {{a.b}} {\"k\": {}}";
        assert!(parse_placeholders(code).is_empty());
    }

    #[test]
    fn empty_default_is_allowed() {
        let p = parse_placeholders("ls {{flags:}}");
        assert_eq!(p[0].default.as_deref(), Some(""));
    }

    #[test]
    fn default_may_contain_colons_and_spaces() {
        let p = parse_placeholders("curl {{url:http://localhost:3000/a b}}");
        assert_eq!(p[0].default.as_deref(), Some("http://localhost:3000/a b"));
    }

    #[test]
    fn renders_values_then_defaults() {
        let out = render_template(
            "ssh {{user:root}}@{{host}} # {{host}}",
            &vals(&[("host", "pi.local")]),
        )
        .unwrap();
        assert_eq!(out, "ssh root@pi.local # pi.local");
    }

    #[test]
    fn explicit_empty_value_overrides_default() {
        let out = render_template("ls {{flags:-la}}", &vals(&[("flags", "")])).unwrap();
        assert_eq!(out, "ls ");
    }

    #[test]
    fn reports_missing_required_values() {
        let err = render_template("{{a}} {{b:x}} {{c}} {{a}}", &HashMap::new()).unwrap_err();
        assert_eq!(err, vec!["a".to_string(), "c".to_string()]);
    }

    #[test]
    fn leaves_non_placeholders_and_unicode_intact() {
        let code = "echo «{{name}}» ${{ x }} {{ y }}";
        let out = render_template(code, &vals(&[("name", "ünï")])).unwrap();
        assert_eq!(out, "echo «ünï» ${{ x }} {{ y }}");
    }
}
