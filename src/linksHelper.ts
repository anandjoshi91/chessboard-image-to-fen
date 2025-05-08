export function createLichessLink(fen: string, reversedFen: string) {
  const linkLichess = document.createElement("a");
  const linkLichessReversed = document.createElement("a");

  linkLichess.href = `https://onlinequicktool.com/chess-next-move/?fen=${fen}`;
  linkLichess.textContent = `Onlinequicktool white perspective: ${fen}`;
  linkLichess.target = "_blank";

  linkLichessReversed.href = `https://onlinequicktool.com/chess-next-move/?fen=${reversedFen}`;
  linkLichessReversed.textContent = `Onlinequicktool black perspective: ${reversedFen}`;
  linkLichessReversed.target = "_blank";

  return [linkLichess, linkLichessReversed] as const;
}

export function createCopyButtons(fen: string, reversedFen: string) {
  const buttonWhite = document.createElement("button");
  const buttonBlack = document.createElement("button");

  buttonWhite.classList.add("copy-btn");
  buttonBlack.classList.add("copy-btn");

  buttonWhite.textContent = "Copy FEN";
  buttonBlack.textContent = "Copy FEN";

  // listen to click
  buttonWhite.addEventListener("click", () => {
    navigator.clipboard.writeText(fen);
  });

  buttonBlack.addEventListener("click", () => {
    navigator.clipboard.writeText(reversedFen);
  });

  return [buttonWhite, buttonBlack] as const;
}
