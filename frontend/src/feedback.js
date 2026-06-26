export function getFeedback(guess, target) {
    const result = Array(5).fill("gray");
    const remaining = target.split("");

    // First pass: greens
    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            result[i] = "green";
            remaining[i] = null;
        }
    }

    // Second pass: yellows
    for (let i = 0; i < 5; i++) {
        if (result[i] === "green") {
            continue;
        }

        const index = remaining.indexOf(guess[i]);

        if (index !== -1) {
            result[i] = "yellow";
            remaining[index] = null;
        }
    }

    return result;
}