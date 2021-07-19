import { screen, fireEvent } from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/react';
const $ = require('jquery');
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills"
import { bills } from "../fixtures/bills.js"
import VerticalLayout from "../views/VerticalLayout"
import {ROUTES, ROUTES_PATH} from "../constants/routes"
import router from "../app/Router.js"
import Dashboard, {filteredBills, cards} from "../containers/Dashboard.js"
import DashboardUI from "../views/DashboardUI.js"
import NewBillUI from "../views/NewBillUI.js"
import Actions from "../views/Actions.js"
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

    // UI ?
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
      const bills = new Bills({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })
      
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const nouvNoteBtn = screen.getByTestId('btn-new-bill')
            
      // const html = NewBillUI()
      const handleClickNewBill = jest.fn(bills.handleClickNewBill) 
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
      const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({pathname})
      }
      const firestore = null
      const dashboard = new Dashboard({
          document,
          onNavigate,
          firestore,
          bills,
          localStorage: window.localStorage
      })

      const handleClickIconEye = jest.fn(dashboard.handleClickIconEye)
      const eye = screen.getAllByTestId('icon-eye')[1]
      const eyeUrl = eye.getAttributeNames('data-bill-url')
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()
      expect(eyeUrl.length).not.toBe(0)

      const modale = screen.getByTestId('modaleFileEmployee')
      expect(modale).toBeTruthy()
      expect(screen.getAllByText('Justificatif')).toBeTruthy()
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

      const modale = screen.getByTestId('modaleFileEmployee')
      const image = screen.findByAltText('bill-img')
      expect(image.src).not.toBeNull()
      expect(image.src).toBe(billUrl.value)
    })

    test.skip("And image width should be half of modal's width", async() => {

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

      const handleClickIconEye = jest.fn((e)=>dashboard.handleClickIconEye(e, eye))
      const eye = screen.getAllByTestId('icon-eye')[1]

      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)

      const modale = screen.getByTestId('modaleFileEmployee')
      expect(modale).toBeTruthy()
      
      const modaleWidth = 900
      const image = screen.findByAltText('bill-img')

      expect(image.width).not.toBeNull()
      expect(image.width).not.toBeUndefined()
      expect(image.width).toEqual(450) 
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
