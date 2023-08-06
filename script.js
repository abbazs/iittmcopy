function removeKatex(element) {
  const clonedElement = element.cloneNode(true);
  const inlineEquations = Array.from(
    clonedElement.querySelectorAll(".inline-equation")
  );

  inlineEquations.forEach((eq) => {
    const annotation = eq.querySelector("annotation");
    if (annotation) {
      eq.replaceWith(`$${annotation.textContent.trim()}$`);
    }
  });

  const text = clonedElement.textContent.replace(/\n/g, " ");
  return text;
}

function getChoiceValues(element) {
  const choices = Array.from(element.querySelectorAll(".gcb-mcq-choice"));

  const choiceValues = choices.map((eq) => {
    return removeKatex(eq);
  });

  const formattedChoices = choiceValues.map((value, index) => {
    return `Choice ${index + 1}: ${value}\n`;
  });

  const formattedChoicesText = formattedChoices.join("\n");

  const output = `\n---\n\nAnswer choices\n\n${formattedChoicesText}`;
  return output;
}

function getButton(id, label) {
  var existingCopyButtons = document.querySelectorAll(`#${id}`);

  // Remove existing button if found
  existingCopyButtons.forEach(function (button) {
    button.parentNode.removeChild(button);
  });
  var copyButton = document.createElement("button");
  copyButton.innerHTML = label;
  copyButton.style.position = "relative";
  copyButton.style.fontSize = "small";
  copyButton.style.top = "0px";
  copyButton.style.right = "opx";
  copyButton.style.right = "opx";
  copyButton.setAttribute("id", id);
  //   Set the button styles
  copyButton.style.background = "lightgray";
  copyButton.style.border = "none";
  copyButton.style.color = "black";
  copyButton.style.padding = "2px 10px";
  copyButton.style.borderRadius = "5px";
  copyButton.style.cursor = "pointer";
  // Add hover effect
  copyButton.addEventListener("mouseover", function () {
    copyButton.style.background = "gray";
  });
  copyButton.addEventListener("mouseout", function () {
    copyButton.style.background = "lightgray";
  });
  return copyButton;
}

function createCopyButton(element, index) {
  var copyButtonId = "copy_" + index;
  var copyButton = getButton(copyButtonId, "Copy");
  copyButton.addEventListener("click", function () {
    playAnimation(element);
    var questionElement = element.querySelector(".qt-question");
    var qe = removeKatex(questionElement);
    var choicesElement = element.querySelector(".qt-choices");
    var ce = "";
    if (choicesElement) {
      ce = getChoiceValues(choicesElement);
    }
    var textToCopy = qe + ce;
    navigator.clipboard.writeText(textToCopy).catch(function (error) {
      console.error("Unable to copy text to clipboard: " + error);
    });
  });
  element.appendChild(copyButton);
}

function addCopyButtons() {
  const questionElements = document.querySelectorAll(".gcb-question-row");

  Array.from(questionElements).forEach((element, index) => {
    createCopyButton(element, index);
  });
}

function wrapSelectedText() {
  var selection = window.getSelection().getRangeAt(0);
  var selectedText = selection.extractContents();
  var span = document.createElement("div");
  span.appendChild(selectedText);
  selection.insertNode(span);
  playAnimation(span);
  return span;
}

function addCopySelectedGlobalButtion() {
  var titleElement = document.querySelector(".modules__content-head-title");
  var copyButton = getButton("copy_selected", "Copy selected");
  copyButton.addEventListener("click", function () {
    var textToCopy = removeKatex(wrapSelectedText());
    navigator.clipboard.writeText(textToCopy).catch(function (error) {
      console.error("Unable to copy text to clipboard: " + error);
    });
  });
  titleElement.appendChild(copyButton);
}

function playAnimation(el) {
  if (el.nodeType === Node.TEXT_NODE) {
    el = el.parentNode;
  }
  el.classList.remove("highlight");
  setTimeout(() => {
    el.classList.add("highlight");
  }, 0);
}

function addHighlighter() {
  const style = document.createElement("style");
  style.textContent = `
      .highlight {
        animation: highlight linear 2s;
      }
  
      @keyframes highlight {
        from {
          outline: 1px solid gray;
          background-color: lightgray;
        }
        to {
          outline: 1px solid #f000;
          background-color: None;
        }
      }
    `;
  document.head.appendChild(style);
}

function injectPrintStyles() {
  var style = document.createElement("style");
  style.innerHTML = `
    @media print {
      /* Avoid page breaks */
      * {
        break-after: avoid !important;
      }
    }
  `;

  document.head.appendChild(style);
}
function addPrintGlobalButtion() {
  var titleElement = document.querySelector(".modules__content-head-title");
  var printButton = getButton("print_button", "Print Page");
  printButton.style.marginLeft = "5px";
  printButton.addEventListener("click", function () {
    const content = document.querySelector("html");
    const buttons = content.querySelectorAll("button");
    buttons.forEach((button) => {
      button.remove();
    });
    const sections = content.querySelectorAll("section");
    sections.forEach((section) => {
      section.remove();
    });
    const sidnav = content.querySelectorAll("mat-sidenav");
    sidnav.forEach((element) => {
      element.remove();
    });
    const elements = content.querySelectorAll(".custom-scrollbar");
    elements.forEach((element) => {
      element.classList.remove("custom-scrollbar");
      element.removeAttribute("style");
    });
    injectPrintStyles();
    window.print();
    location.reload();
  });
  titleElement.appendChild(printButton);
}

addCopyButtons();
addCopySelectedGlobalButtion();
addHighlighter();
addPrintGlobalButtion();

// modules__content custom-scrollbar assignment
