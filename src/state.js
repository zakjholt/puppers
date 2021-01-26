// Holds the app state
// Flow should be,
// 1) Change state, generating new state
// 2) Call onStateChange with the new state
export class State {
  constructor({ client, onStateChange = () => {} }) {
    this.client = client;
    this.onStateChange = onStateChange;
  }

  _state = {
    breedOptions: [],
    selectedBreedValue: "shiba",
    currentPhoto: undefined,
    previousPhotos: [],
    breedsModalOpen: false,
  };

  getState = () => this._state;

  generateNextState = (newState) => {
    const nextState = { ...this._state, ...newState };

    this._state = nextState;
    this.onStateChange(this._state);
  };

  onBreedSelect = async (event) => {
    const breedName = event.target.value;

    const newPhotoData = await this.getNewPhotoData(breedName);

    const newState = {
      selectedBreedValue: breedName,
      ...newPhotoData,
    };

    this.generateNextState(newState);
  };

  onNewPicButtonClick = async () => {
    const newPhotoData = await this.getNewPhotoData();
    this.generateNextState(newPhotoData);
  };

  getNewPhotoData = async (breedName = this._state.selectedBreedValue) => {
    const breedImageUrl = await this.client.getRandomBreedImageUrl(breedName);

    const photoObj = {
      url: breedImageUrl,
      alt: breedName,
    };

    const newState = {
      currentPhoto: photoObj,
    };

    if (this._state.currentPhoto) {
      const newPreviousPhotos = [
        this._state.currentPhoto,
        ...this._state.previousPhotos,
      ];

      newState.previousPhotos = newPreviousPhotos;
    }

    return newState;
  };

  toggleBreedsModal = () => {
    const { breedsModalOpen } = this._state;

    this.generateNextState({ breedsModalOpen: !breedsModalOpen });
  };

  onBreedOptionImgClick = (event) => {
    event.stopPropagation();

    this.generateNextState({
      breedsModalOpen: false,
      currentPhoto: {
        url: event.target.src,
        alt: event.target.alt,
      },
      selectedBreedValue: event.target.value,
    });
  };

  onPreviousPhotoClick = (e) => {
    const photoUrl = e.target.src;
    const photoObj = this._state.previousPhotos.find(
      (po) => po.url === photoUrl
    );
    const nextPreviousPhotos = [
      this._state.currentPhoto,
      ...this._state.previousPhotos,
    ];
    this.generateNextState({
      currentPhoto: photoObj,
      previousPhotos: nextPreviousPhotos,
    });
  };
}
