
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"



export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    new Logout({ document, localStorage, onNavigate })

    const submitBtn = document.getElementById('btn-send-bill');
    submitBtn.setAttribute('disabled', true);
  }

  handleChangeFile = async(e) => {
    
    let file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    console.log(file);
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length-1]
    try {
      if (this.firestore) {
        await this.firestore.storage
        .ref(`justificatifs/${fileName}`)
        .put(file)
          .then(snapshot => snapshot.ref.getDownloadURL()) //  firestore sents back an url for image location
          .then(url => {
            this.fileUrl = url
            this.fileName = fileName
          })
          const submitBtn = document.getElementById('btn-send-bill');
          if (this.fileUrl !== null && this.fileName !== null) { 
            submitBtn.removeAttribute('disabled', true);
            console.log( this.fileName, this.fileUrl)
          } else { throw new Error('file url was not retrieved')}
      }
    } catch (error) { console.log(error)}
  }

  /*   
    handleChangeFile = e => {
        - ORIGINAL CHUNK - issue : possibility to submit an image before firebase sends url back for it => fileUrl and fileName stay null (default constructor values)
      let file = this.document.querySelector(`input[data-testid="file"]`).files[0]
      let img = e.target.value
      // console.log(img) // C:\fakepath\Screen Shot 2021-05-29 at 11.22.15-fullpage.png
      const filePath = e.target.value.split(/\\/g)
      const fileName = filePath[filePath.length-1]
      
      this.firestore.storage
      .ref(`justificatifs/${fileName}`)
      .put(file)
        .then(snapshot => snapshot.ref.getDownloadURL()) //  firestore sents back an url for image location
        .then(url => {
          this.fileUrl = url
          this.fileName = fileName
        })
        console.log( this.fileName, this.fileUrl) // !! WORKS ONLY WHEN A SECOND IMAGE IS SELECTED, OTHERWISE DEFAULT CONSTRUCTOR VALUES
  } */

  handleSubmit = e => {
    if (this.fileUrl !== null && this.fileName!== null ) { 
      e.preventDefault()
      console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
      const email = JSON.parse(localStorage.getItem("user")).email
      const bill = {
        email,
        type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
        name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
        amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
        date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
        vat: e.target.querySelector(`input[data-testid="vat"]`).value,
        pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
        commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
        fileUrl: this.fileUrl,
        fileName: this.fileName,
        status: 'pending'
      }
      this.createBill(bill)
      this.onNavigate(ROUTES_PATH['Bills'])
    }
    else { 
      e.preventDefault()
    }
  }

  // not need to cover this function by tests
  createBill = (bill) => {
    if (this.firestore) {
      this.firestore
      .bills()
      .add(bill)
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => error)
    }
  }
}