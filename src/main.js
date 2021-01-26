import "./main.css";
import { State } from "./state";
import { DogCeoClient } from "./client";

// Maps keynames to dom selector
const elementsMap = {
  breedSelectContainer: document.querySelector(".breed_select_container"),
  photoContainer: document.querySelector(".photo_container"),
  previousPhotosContainer: document.querySelector(".previous_photos_container"),
  newPhotoButton: document.querySelector(".new_photo_button"),
  breedsModal: document.querySelector(".breeds_modal"),
  breedsModalButton: document.querySelector(".breeds_modal_button"),
  breedsModalOverlay: document.querySelector(".breeds_modal__overlay"),
  breedsModalGrid: document.querySelector(".breeds_modal__grid"),
};

const addInitialListeners = () => {
  elementsMap.newPhotoButton.addEventListener(
    "click",
    state.onNewPicButtonClick
  );
  elementsMap.breedsModalOverlay.addEventListener(
    "click",
    state.toggleBreedsModal
  );
  elementsMap.breedsModalButton.addEventListener(
    "click",
    state.toggleBreedsModal
  );
};

// Useful for safely removing nodes inside of a parent. Also cleans up event listeners
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const syncUi = async (nextState) => {
  const {
    breedOptions,
    selectedBreedValue,
    currentPhoto,
    previousPhotos,
    breedsModalOpen,
  } = nextState;

  if (breedOptions.length) {
    removeAllChildNodes(elementsMap.breedSelectContainer);
    // put breed select with options inside container
    const select = document.createElement("select");
    breedOptions.forEach((bo) => {
      // add an option to the select
      const option = document.createElement("option");
      option.textContent = bo.label;
      option.value = bo.value;
      option.selected = bo.value === selectedBreedValue;

      select.appendChild(option);
    });
    elementsMap.breedSelectContainer.appendChild(select);
    select.addEventListener("change", state.onBreedSelect);

    // Also populate the breed greed
    // I'm aware that we're looping through breedOptions twice in here,
    // but I don't want the select to be blocked while we fetch urls for the breeds
    removeAllChildNodes(elementsMap.breedsModalGrid);
    const breedImgTiles = await Promise.all(
      breedOptions.map(async (bo) => {
        const breedOptionItem = document.createElement("div");
        const breedOptionImg = document.createElement("img");
        const breedUrl = await client.getRandomBreedImageUrl(bo.value);
        breedOptionImg.alt = bo.value;
        breedOptionImg.src = breedUrl;
        breedOptionImg.value = bo.value;
        breedOptionImg.onclick = state.onBreedOptionImgClick;
        breedOptionItem.appendChild(breedOptionImg);

        const breedOptionLabel = document.createElement("div");
        breedOptionLabel.classList.add("label");
        breedOptionLabel.textContent = bo.value;
        breedOptionItem.appendChild(breedOptionLabel);

        return breedOptionItem;
      })
    );

    breedImgTiles.forEach((t) => elementsMap.breedsModalGrid.appendChild(t));
  }

  if (currentPhoto) {
    // put photo inside container
    removeAllChildNodes(elementsMap.photoContainer);
    const img = document.createElement("img");
    img.alt = currentPhoto.alt;
    img.src = currentPhoto.url;
    elementsMap.photoContainer.appendChild(img);
  }

  if (previousPhotos.length) {
    // put previous photos in here
    removeAllChildNodes(elementsMap.previousPhotosContainer);
    previousPhotos.forEach((p) => {
      const img = document.createElement("img");
      img.alt = p.alt;
      img.src = p.url;
      elementsMap.previousPhotosContainer.appendChild(img);
      img.onclick = state.onPreviousPhotoClick;
    });
  }

  if (breedsModalOpen) {
    elementsMap.breedsModal.classList.remove("hidden");
  } else {
    elementsMap.breedsModal.classList.add("hidden");
  }
};

const client = new DogCeoClient();
const state = new State({ client, onStateChange: syncUi });

const initApp = async () => {
  const breedOptions = await client.getBreedOptions();
  const newPhotoData = await state.getNewPhotoData();
  state.generateNextState({ breedOptions, ...newPhotoData });
  addInitialListeners();
};

window.onload = initApp;
