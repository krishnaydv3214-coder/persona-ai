export function getFakeResponse(
  persona: string | null
): string {
  if (persona === "hitesh") {
    return "Haanji! Let's understand this concept together.";
  }

  if (persona === "piyush") {
    return "Let's break this problem into smaller parts.";
  }

  return "Please select a persona first.";
}