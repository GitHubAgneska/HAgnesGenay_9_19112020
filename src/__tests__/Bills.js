import { screen, fireEvent } from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/react';
const $ = require('jquery');
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bill from "../containers/Bills"
import { bills } from "../fixtures/bills.js"
import {ROUTES} from "../constants/routes"
import Dashboard from "../containers/Dashboard.js"
import firebase from "../__mocks__/firebase"
import { localStorageMock } from "../__mocks__/localStorage.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("Then I should see a list of my own bills", () => { 
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const billsList = screen.getByTestId('tbody')
      expect(billsList).toBeTruthy();
    })


    // use firebase with 'Ordering by a specified child key' instead ? 
    //  https://firebase.google.com/docs/database/admin/retrieve-data
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })


    test("Then there should be a /'nouvelle note de frais'/ button", () => { 
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const nouvNoteBtn = screen.getByTestId('btn-new-bill')
      expect(nouvNoteBtn).toBeTruthy()
    })
  })
})

describe("Given I am connected as an employee and I am on bills page", () => {
  describe('When I click on \'nouvelle note de frais\' ', () => {
    test("Then I should be sent to newBill page", () => {

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })}

      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      const firestore = null
      const bill = new Bill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })
      
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const nouvNoteBtn = screen.getByTestId('btn-new-bill')
            
      // const html = NewBillUI()
      const handleClickNewBill = jest.fn(bill.handleClickNewBill) 
      nouvNoteBtn.addEventListener('click', handleClickNewBill)
      
      userEvent.click(nouvNoteBtn) 
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
})

describe("Given I am connected as an employee and I am on bills page", () => {
  describe('When I click on the icon eye of a bill', () => {
    test("Then a modal should open", () => {
  
      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) }

      const bill = new Bill({ document, onNavigate, firestore: null, localStorage: window.localStorage })

      const eye = screen.getAllByTestId('icon-eye')[1]
      $.fn.modal = jest.fn();
      const handleClickIconEye = jest.fn(bill.handleClickIconEye(eye))
      const eyeUrl = eye.getAttributeNames('data-bill-url')
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()
      expect(eyeUrl.length).not.toBe(0)

      const modale = screen.getByTestId('modaleFileEmployee')
      expect(modale).toBeTruthy()
      expect(screen.getByText('Justificatif')).toBeTruthy()
    })
  })
})


describe("Given I am connected as an employee and I am on bills page", () => {
  describe('When I have clicked on the eye-icon of first bill and a modal is open', () => {
    
    test("Then an image should be displayed", async() => {
      
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) }
      const dashboard = new Dashboard({
        document,
        onNavigate,
        firestore:null,
        bills,
        localStorage: window.localStorage
    })

      const handleClickIconEye = jest.fn(dashboard.handleClickIconEye)
      const eye = screen.getAllByTestId('icon-eye')[1]
      const billUrl = eye.getAttributeNames('data-bill-url')
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      $.fn.modal = jest.fn();
      const image = screen.findByAltText('bill-img')
      expect(image.src).not.toBeNull()
      expect(image.src).toBe(billUrl.value)
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as an employee", () => {
  describe("When I am on Bills Page", () => {
      test("fetches bills from mock API GET", async () => {
          const getSpy = jest.spyOn(firebase, "get")
          const bills = await firebase.get()
          expect(getSpy).toHaveBeenCalledTimes(1)
          expect(bills.data.length).toBe(4)
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
          firebase.get.mockImplementationOnce(() => Promise.reject(new Error("Erreur 404")))
          const html = BillsUI({error: "Erreur 404"})
          document.body.innerHTML = html
          const message = await screen.getByText(/Erreur 404/)
          expect(message).toBeTruthy()
      })
      test("fetches messages from an API and fails with 500 message error", async () => {
          firebase.get.mockImplementationOnce(() => Promise.reject(new Error("Erreur 500")))
          const html = BillsUI({error: "Erreur 500"})
          document.body.innerHTML = html
          const message = await screen.getByText(/Erreur 500/)
          expect(message).toBeTruthy()
      })
  })
})
