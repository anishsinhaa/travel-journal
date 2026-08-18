/** Pop the edit/create page off the stack instead of pushing a duplicate destination. */
export function exitFlow(navigate, fallback = "/") {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate(fallback, { replace: true });
  }
}
