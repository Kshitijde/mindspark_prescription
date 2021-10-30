const addMedication = () => {
    var medicationContainer = document.querySelector('.medication-container')
    const medication = document.querySelector('.medication')
    medicationContainer.insertAdjacentHTML('beforeend', medication.innerHTML)
}