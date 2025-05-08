export function createOQTLink(fen: string, reversedFen: string) {
  const encodedFen = encodeURIComponent(fen);
  const encodedReversedFen = encodeURIComponent(reversedFen);

  const oqtLink = document.createElement("a");
  const oqtLinkReversed = document.createElement("a");

  oqtLink.href = `https://onlinequicktool.com/chess-next-move/?fen=${encodedFen}`;
  oqtLink.textContent = `Onlinequicktool white perspective: ${fen}`;
  oqtLink.target = "_blank";

  oqtLinkReversed.href = `https://onlinequicktool.com/chess-next-move/?fen=${encodedReversedFen}`;
  oqtLinkReversed.textContent = `Onlinequicktool black perspective: ${reversedFen}`;
  oqtLinkReversed.target = "_blank";

  return [oqtLink, oqtLinkReversed] as const;
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