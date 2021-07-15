import { screen, fireEvent } from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/react';
const $ = require('jquery');
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills"
import { bills } from "../fixtures/bills.js"
import VerticalLayout from "../views/VerticalLayout"
import { localStorageMock } from "../__mocks__/localStorage.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes"
import Dashboard, {filteredBills, cards} from "../containers/Dashboard.js"
import DashboardUI from "../views/DashboardUI.js"
import NewBillUI from "../views/NewBillUI.js"
import Actions from "../views/Actions.js"



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", () => {
      // connected as an employee
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)
      
      const html = BillsUI({ data: bills})
      const verticalLayout = VerticalLayout(120)
      expect(verticalLayout).toBeTruthy()
      
      document.body.innerHTML = html
      const icon = screen.getByTestId('icon-window')
      //expect(icon).toHaveClass('active-icon')
    })

    test("Then I should see a list of my own bills", () => { 
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const billsList = screen.getByTestId('tbody')
      expect(billsList).toBeTruthy();
    })

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
  describe('When page content is loading', () => {
    test("Then I should see \' Loading...\'", () => {
      
    })
  })
  describe('When there is an error', () => {
    test("Then I should see an error message", () => {

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
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()


      const modale = screen.getByTestId('modaleFileEmployee')
      expect(modale).toBeTruthy()
      expect(screen.getAllByText('Justificatif')).toBeTruthy()
    })
  })
})


describe("Given I am connected as an employee and I am on bills page", () => {
  describe('When I have clicked on the eye-icon of first bill and a modal is open', () => {
    
    test("Then an image should be displayed", () => {

      const url = 'https://firebasestorage.googleapis.com/v0/b/billable-677b6.appspot.com/o/justificatifs%2FScreenshot%202020-05-26%20at%2020.03.10.png?alt=media&token=b6bfaf5f-4257-429c-934e-e9b31126f7a7'
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const modale = screen.getByTestId('modaleFileEmployee')
      const image = screen.findByAltText('bill-img')
      expect(image.src).toBe(url)

    })

    test("And image width should be half of modal's width", () => {

      const html = BillsUI({data: bills})
      document.body.innerHTML = html

      const img = screen.findByAltText('bill-img')
      const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
      expect(img.width).toBe(imgWidth);
    })
  })
})
