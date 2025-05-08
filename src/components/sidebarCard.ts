import { DetectionCanvas } from "./detection-canvas";
import { NN } from "../nnHelper";
import { ChessBoardCanvas } from "./previewCanvas";
import { detectionCanvasList } from "../renderBoxes";
import { Sidebar } from "./sidebar";
import { normalizeFenString } from "../utils";
import { createOQTLink } from "../linksHelper";

const outlineSVG = document.querySelector(".outline-svg_svg")!;

export function createSidebarCard(
  detectionCanvas: DetectionCanvas,
  fenWhite: string,
  fenBlack: string
) {
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("detection-card");

  // * ============
  // * button panel

  const previewPredictionBtn = document.createElement("button");
  previewPredictionBtn.textContent = "preview";
  previewPredictionBtn.classList.add(`data-predict-id-${detectionCanvas.id}`);

  const predictBtn = document.createElement("button");
  predictBtn.textContent = "predict";

  const deleteCardBtn = document.createElement("button");
  deleteCardBtn.textContent = "delete";

  const buttonsPanel = document.createElement("div");
  buttonsPanel.append(predictBtn, previewPredictionBtn, deleteCardBtn);
  buttonsPanel.classList.add("detection-card__btn-panel");

  predictBtn.addEventListener("click", () => {
    previewPredictionBtn.textContent = "preview";

    const [f1, f2] = NN.classification.classifyCanvas(
      detectionCanvas.toGrayScale().canvas
    );

    fenW.value = f1;
    fenB.value = f2;

    // Update the OQT links when prediction is made
    updateOQTLinks(f1, f2);

    const helperCanvas = new ChessBoardCanvas(
      detectionCanvas.width,
      detectionCanvas.height
    );
    const normFen = normalizeFenString(f1).filter((el) => el !== "/");
    helperCanvas.drawChessboardFromFen(normFen);

    previewCanvas.width = detectionCanvas.width;
    previewCanvas.height = detectionCanvas.height;

    previewCtx.putImageData(helperCanvas.imageData, 0, 0);
  });

  deleteCardBtn.addEventListener("click", () => {
    const index = detectionCanvasList.findIndex((el) => {
      return el.id === detectionCanvas.id;
    });

    detectionCanvasList.splice(index, 1);

    const cards = Sidebar.getPredictionCards();

    cards.forEach((card) => {
      const cardCanvas = card.querySelector("canvas")!;
      const dataId = parseInt(cardCanvas.getAttribute("data-id")!);

      if (dataId === detectionCanvas.id) {
        Sidebar.removeCard(card);
      }
    });

    const groups = outlineSVG.querySelectorAll("g");
    groups.forEach((group) => {
      const dataId = parseInt(group.getAttribute("data-id")!);

      if (dataId === detectionCanvas.id) {
        outlineSVG.removeChild(group);
      }
    });
  });

  // * ============
  // * fen

  const fenContainer = document.createElement("div");
  fenContainer.classList.add("fen-container");

  const fenW = document.createElement("input");
  const fenB = document.createElement("input");

  const copyFENBtnW = document.createElement("button");
  const copyFENBtnB = document.createElement("button");

  copyFENBtnW.addEventListener("click", () => {
    navigator.clipboard.writeText(fenWhite);
  });

  copyFENBtnB.addEventListener("click", () => {
    navigator.clipboard.writeText(fenBlack);
  });

  copyFENBtnW.textContent = "copy";
  copyFENBtnB.textContent = "copy";

  fenW.value = fenWhite;
  fenB.value = fenBlack;

  fenW.disabled = true;
  fenB.disabled = true;
  fenContainer.append(fenW, copyFENBtnW, fenB, copyFENBtnB);

  // * ============
  // * OQT Links
  
  const linkContainer = document.createElement("div");
  linkContainer.classList.add("link-container");
  
  // Initialize link variables in wider scope for later reference
  const [initialOqtLinkWhite, initialOqtLinkBlack] = createOQTLink(fenWhite, fenBlack);
  
  // Create buttons for the links
  const oqtButtonWhite = document.createElement("button");
  oqtButtonWhite.textContent = "Open in OQT (White)";
  oqtButtonWhite.classList.add("oqt-link-btn");
  oqtButtonWhite.dataset.href = initialOqtLinkWhite.href;
  oqtButtonWhite.addEventListener("click", () => {
    window.open(oqtButtonWhite.dataset.href, "_blank");
  });
  
  const oqtButtonBlack = document.createElement("button");
  oqtButtonBlack.textContent = "Open in OQT (Black)";
  oqtButtonBlack.classList.add("oqt-link-btn");
  oqtButtonBlack.dataset.href = initialOqtLinkBlack.href;
  oqtButtonBlack.addEventListener("click", () => {
    window.open(oqtButtonBlack.dataset.href, "_blank");
  });
  
  linkContainer.append(oqtButtonWhite, oqtButtonBlack);
  
  // Function to update OQT links when prediction is made
  function updateOQTLinks(whitefen: string, blackfen: string) {
    const [newOqtLinkWhite, newOqtLinkBlack] = createOQTLink(whitefen, blackfen);
    
    // Update the data-href attributes with the new URLs
    oqtButtonWhite.dataset.href = newOqtLinkWhite.href;
    oqtButtonBlack.dataset.href = newOqtLinkBlack.href;
  }

  const canvasWrapper = document.createElement("div");
  canvasWrapper.classList.add("detection-card__canvas-wrapper");

  // ! dev ----------

  const normFen = normalizeFenString(fenWhite).filter((el) => el !== "/");
  const helperCanvas = new ChessBoardCanvas(
    detectionCanvas.width,
    detectionCanvas.height
  );

  helperCanvas.drawChessboardFromFen(normFen);

  const previewCanvas = document.createElement("canvas");
  const previewCtx = previewCanvas.getContext("2d")!;
  previewCanvas.width = detectionCanvas.width;
  previewCanvas.height = detectionCanvas.height;

  previewCanvas.classList.add("preview-canvas");
  previewCanvas.classList.add("hidden");

  previewCtx.putImageData(helperCanvas.imageData, 0, 0);

  canvasWrapper.append(detectionCanvas.canvas, previewCanvas);
  // * ============

  previewPredictionBtn.addEventListener("pointerdown", () => {
    previewCanvas.classList.remove("hidden");
  });

  previewPredictionBtn.addEventListener("pointerup", () => {
    previewCanvas.classList.add("hidden");
  });

  cardWrapper.append(buttonsPanel, canvasWrapper, fenContainer, linkContainer);

  return {
    card: cardWrapper,
    appendCardToSidebar: () => {
      Sidebar.addCard(cardWrapper);
    },
  };
}