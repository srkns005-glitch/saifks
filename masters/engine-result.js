export function success(data, warnings = []) {
  return Object.freeze({
    success: true,
    data: Object.freeze(data),
    warnings: Object.freeze([...warnings]),
    errors: Object.freeze([])
  });
}

export function failure(errors, warnings = []) {
  const normalized = Array.isArray(errors) ? errors : [errors];
  return Object.freeze({
    success: false,
    data: null,
    warnings: Object.freeze([...warnings]),
    errors: Object.freeze(normalized.map(String))
  });
}
