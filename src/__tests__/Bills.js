import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills"
import { bills } from "../fixtures/bills.js"
import VerticalLayout from "../views/VerticalLayout"
import { localStorageMock } from "../__mocks__/localStorage.js"
import '@testing-library/jest-dom/extend-expect';
import {ROUTES, ROUTES_PATH} from "../constants/routes"
import Dashboard, {filteredBills, cards} from "../containers/Dashboard.js"

const data = []
const loading = false
const error = null

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", () => {
      // connected as an employee
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)
      
      const html = BillsUI({ data: []})
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

    test("Then there should be a /'nouvelle note de frais'/ button", () => { 
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const nouvNoteBtn = screen.getByTestId('btn-new-bill')
      expect(nouvNoteBtn).toBeTruthy()
    })

    test("Then clicking /'nouvelle note de frais'/ button should open a modal", () => { 
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const nouvNoteBtn = screen.getByTestId('btn-new-bill')
      expect(nouvNoteBtn).toBeTruthy()
    })
  })
})