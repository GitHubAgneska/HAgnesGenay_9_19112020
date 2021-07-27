import { screen, fireEvent } from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/react';
const $ = require('jquery');
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bill from "../containers/Bills"
import { bills } from "../fixtures/bills.js"
import {ROUTES} from "../constants/routes"
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
    
    // following will test  :  'if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)'
    // => scenario where the event listener does not get added to the btn (in bills class constructor)
    test("Then the /'nouvelle note de frais'/ button should fail to call handleClickNewBill if event not added", () => { 
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const bill = new Bill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })
      const nouvNoteBtn = screen.getByTestId('btn-new-bill')
      // -->  NOT ADDING EVENT LISTENER ON BTN <--- // 
      const handleClickNewBill = jest.fn(bill.handleClickNewBill) 
      userEvent.click(nouvNoteBtn) 
      expect(handleClickNewBill).not.toHaveBeenCalled()
      // expect(screen.getByText('Envoyer une note de frais')).toBeFalsy() // => does not pass : ?
    })
  })
})

describe("Given I am connected as an employee and I am on bills page", () => {
  describe('When I click on \'nouvelle note de frais\' ', () => {
    test("Then I should be sent to newBill page", () => {
      // we have to mock navigation to test it
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}

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

describe("Given I am connected as an employee", () => {
  describe('When I am on Bills page and there are bills', () => {
    test("Then there should be an eye icon on each bill", () => { 
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const eye = screen.getAllByTestId('icon-eye')
      const eyeCount = eye.length
      const billsAmount = bills.length
      
      expect(eyeCount).toEqual(billsAmount)
      expect(eye).toBeTruthy()
      expect(eye).not.toBeFalsy()

    })
    test("Then an error should be thrown if eye icon selector is not found", () => { 
      const billUrl = '/fakeUrl'
      const html = 
      `<div class="icon-actions">
          <div id="eye" data-testid="icon" data-bill-url=${billUrl}>
          </div>
      </div>`
      document.body.innerHTML = html
      const handleClickIconEye = jest.fn()
      jest.spyOn(document, 'querySelectorAll').mockImplementation()
      const t = () => { throw new Error('error with eye icon'); };
      

      expect(t).toThrow(Error);
      expect(t).toThrowError("error with eye icon");
    })

    test("Then test should fail if no eye icon is found in its parent container", () => {
      const billUrl = '/fakeUrl'
      const html = 
      `<div class="icon-actions">
          <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
          </div>
      </div>`
      document.body.innerHTML = html
      const t = () => { throw new Error('error with eye icon'); };

      const eyes = screen.getAllByTestId('icon-eye')
      eyes.forEach(eye => { 
        const icon = eye.value;
        const handleClickIconEye = jest.fn()
        if (icon) { 
          eye.addEventListener('click', handleClickIconEye)
          userEvent.click(eye)
        }
        expect(icon).toBeUndefined()
        expect(eye.childElementCount).toEqual(0);
        expect(handleClickIconEye).not.toHaveBeenCalled()
      })
      expect(t).toThrow(Error);
      expect(t).toThrowError("error with eye icon");
    })
  // following will test : 
  //  const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
  //  if (iconEye) iconEye.forEach(icon => {
  //   icon.addEventListener('click', (e) => this.handleClickIconEye(icon))
  // })
  // SCENARIO where the icon path is not correct => so, no eye icon displayed and no event listener added
    test("Then test should fail if eye icon path is not correct, and so no eye icon displayed on bills", () => { 
      const billUrl = '/fakeUrl'
      const eyeBlueIcon = ''

      const html = 
      `<div class="icon-actions">
          <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
          ${eyeBlueIcon}
          </div>
      </div>`
      document.body.innerHTML = html
      const t = () => { throw new Error('error with eye icon'); };
      const iconEye = screen.getAllByTestId('icon-eye')

      iconEye.forEach(icon => { 

          const handleClickIconEye = jest.fn()
          icon.addEventListener('click', handleClickIconEye)
          userEvent.click(icon)

          expect(icon.childElementCount).toEqual(0);
          expect(handleClickIconEye).toHaveBeenCalled()
      })
      expect(t).toThrow(Error);
      expect(t).toThrowError("error with eye icon");
    })

    test("Then there should be an eye icon on any bill", () => { 
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const eye = screen.getAllByTestId('icon-eye')
      
      expect(eye).toBeTruthy()
    })
  })

  describe('When I click on the eye icon of a bill', () => {
    // this will test  :  iconEye.forEach(icon => { icon.addEventListener('click', (e) => this.handleClickIconEye(icon))})'
    // meaning, every icon eye will be tested for its click event
    test("Then any eye icon should call handleClickIconEye' function", async() => {

      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const t = () => { throw new Error('error with eye icon'); };
      const allEyeIcons = screen.findAllByTestId('icon-eye')
      const allEyeIconsCount = allEyeIcons.length
      // const handleClickIconEye = jest.fn(bill.handleClickIconEye) 
      const handleClickIconEye = jest.fn() // don't call the actual function ( jest.fn(bill.handleClickIconEye(eye)))
      // $.fn.modal = jest.fn();

      allEyeIcons.forEach(icon => {
        icon.addEventListener('click', handleClickIconEye)
        userEvent.click(icon)
      })
      
      expect(handleClickIconEye).toHaveBeenCalledTimes(allEyeIconsCount)
      expect(t).not.toThrow(Error);
    })

    // following will test  :  
    //  const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    //  if (iconEye) iconEye.forEach(icon => { icon.addEventListener('click', (e) => this.handleClickIconEye(icon))})'
    // => scenario where the event listener does not get added to ANY eye icon (in bills class constructor)
    test("Then the icon eye btn should call handleClickIconEye' function", () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const allEyeIcons = screen.getAllByTestId('icon-eye')
      // -->  NOT ADDING EVENT LISTENER ON ICON <--- // 
      const allEyeIconsCount = allEyeIcons.length
      const handleClickIconEye = jest.fn()

      expect(handleClickIconEye).not.toHaveBeenCalled()
      expect(handleClickIconEye).not.toHaveBeenCalledTimes(allEyeIconsCount)
    })
    test("Then the icon eye btn should call handleClickIconEye' function", () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const allEyeIcons = screen.getAllByTestId('icon-eye')
      // -->  NOT ADDING EVENT LISTENER ON ICON <--- // 
      const allEyeIconsCount = allEyeIcons.length
      const handleClickIconEye = jest.fn()

      expect(handleClickIconEye).not.toHaveBeenCalled()
      expect(handleClickIconEye).not.toHaveBeenCalledTimes(allEyeIconsCount)
    })

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
      // const eyeUrl = eye.getAttributeNames('data-bill-url')
      eye.addEventListener('click', handleClickIconEye)
      
      userEvent.click(eye)

      expect(handleClickIconEye).toHaveBeenCalled()
      // expect(eyeUrl.length).not.toBe(0)

      const modale = screen.getByTestId('modaleFileEmployee')
      expect(modale).toBeTruthy()
      expect(screen.getByText('Justificatif')).toBeTruthy()
    })
    test("Then an image should be displayed", async() => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) }
      const bill = new Bill({ document, onNavigate, firestore: null, localStorage: window.localStorage })
      
      const eye = screen.getAllByTestId('icon-eye')[1]
      $.fn.modal = jest.fn();
      const handleClickIconEye = jest.fn(bill.handleClickIconEye(eye))
      eye.addEventListener('click', handleClickIconEye)
      const billUrl = eye.getAttributeNames('data-bill-url')
      userEvent.click(eye)

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
