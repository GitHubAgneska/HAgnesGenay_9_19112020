import {screen, fireEvent} from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/react';
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js"

import {bills} from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes"
//import firebase from "../__mocks__/firebase"
import firebase from "firebase";
import BillsUI from "../views/BillsUI.js"
// connected as an employee
Object.defineProperty(window, "localStorage", { value: localStorageMock });
window.localStorage.setItem(
    "user",
    JSON.stringify({
        type: "Employee",
    })
    );

    describe("Given I am connected as an employee", () => {
        describe("When I am on NewBill Page", () => {
            test("Then post should fail if required fields are not filled out", () => { // actually, if sending an empty object (not testing fields are filled out)
                const html = NewBillUI()
                document.body.innerHTML = html
                
                const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) }
                const formNewBill = screen.getByTestId('form-new-bill')            
                const newbill = new NewBill({document, onNavigate, firestore: null, localStorage: window.localStorage})
                const emptyBillMock = {}
                const handleSubmit = jest.fn(newbill.handleSubmit)
                const createBill = jest.fn(emptyBillMock)
        
                formNewBill.addEventListener('submit', handleSubmit)
                fireEvent.submit(formNewBill)
                
                expect(handleSubmit).toHaveBeenCalled();    
                expect(createBill).not.toHaveBeenCalled();
            })
        })
    })

    describe("Given I am connected as an employee", () => {
        describe("When I am on NewBill Page and click on browse btn", () => {
            test("Then I should be able to select a file and see its name once selected", () => {
                const html = NewBillUI()
                document.body.innerHTML = html
                const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) } 
                
                const newbill = new NewBill({document, onNavigate, localStorage: window.localStorage})
                const fileInput = screen.getByTestId('file')
                const handleChangeFile = jest.fn(newbill.handleChangeFile)
                fileInput.addEventListener('change', handleChangeFile)
                const fileMock = 'abcdef890.png'
                fireEvent.change(fileInput, { target: { files: [new File( [fileMock], fileMock)]} })

                expect(handleChangeFile).toHaveBeenCalled()
                expect(fileInput.files[0].name).toBe(fileMock)
            })
        })
    }) 
    describe("Given I am connected as an employee", () => {
        describe("When I am on NewBill Page and have selected an image to upload", () => {
            test("Then firebase should be called through handleChangeFile function and return an url", () => {
                const html = NewBillUI()
                document.body.innerHTML = html
                const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) } 
                
                const newbill = new NewBill({document, onNavigate, localStorage: window.localStorage})
                const fileInput = screen.getByTestId('file')
                const handleChangeFile = jest.fn(newbill.handleChangeFile)
                fileInput.addEventListener('change', handleChangeFile,  { once: true })
                const fileMock = 'abcdef890.png'
                fireEvent.change(fileInput, { target: { files: [new File( [fileMock], fileMock)]} },)
                const filePath = e.target.value.split(/\\/g)
                const fileName = filePath[filePath.length-1]
                


                const getSpy = jest.spyOn(firebase.storage, "post")
                var ref = firebase.storage().ref("justificatifs/");
                const newUrl = await firebase.get()
                expect(getSpy).toHaveBeenCalledTimes(1)

                expect(handleChangeFile).toHaveBeenCalled()
                expect(fileInput.files[0].name).toBe(fileMock)
                expect 
                })
            })
        }) 

    describe("Given I am connected as an employee", () => {
        describe("When I am on NewBill Page, have made a new bill and submit it", () => {
            test("Then it should be created", () => {
                const html = NewBillUI()
                document.body.innerHTML = html
                const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) }
                window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
                
                const newbill = new NewBill({document, onNavigate, firestore:null, localStorage: window.localStorage})
                
                screen.getByTestId("expense-type").value =  bills[0].type
                screen.getByTestId("expense-name").value = bills[0].name
                screen.getByTestId("datepicker").value = bills[0].date
                screen.getByTestId("amount").value = bills[0].amount
                screen.getByTestId("vat").value = bills[0].vat
                screen.getByTestId("pct").value = bills[0].pct
                screen.getByTestId("commentary").value = bills[0].commentary

                const formNewBill = screen.getByTestId('form-new-bill') 
                const handleSubmit = jest.fn(newbill.handleSubmit)
                const createBill = jest.fn(newbill.createBill)
                formNewBill.addEventListener('submit', handleSubmit)
                fireEvent.submit(formNewBill)
                
                expect(handleSubmit).toHaveBeenCalled()
                expect(handleSubmit.mock.results).toEqual(
                    [
                        {   type: "return", 
                            value: { email:bills[0].email, type: bills[0].type, name: bills[0].name, amount: bills[0].amount, date: bills[0].date, vat:bills[0].vat, pct: bills[0].pct, commentary: bills[0].commentary, fileUrl: bills[0].fileUrl, fileName: bills[0].fileName},
                            value : createBill()
                        }])
                })
            test("Then it should render Bills page", () => {
                expect(screen.getByText('Mes notes de frais')).toBeTruthy()
            })
        })
    })
    //test d'intégration POST
    describe("Given I am a user connected as Employee", () => {
        describe("When I create a new bill", () => {
        test("Add bill to mock API POST", async () => {
            const getSpy = jest.spyOn(firebase, "post")
            const newBill = {
                id: "47qAXb6fIm2zOKkLzMro",
                vat: "80",
                fileUrl: "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
                status: "pending",
                type: "Hôtel et logement",
                commentary: "séminaire billed",
                name: "encore",
                fileName: "preview-facture-free-201801-pdf-1.jpg",
                date: "2004-04-04",
                amount: 400,
                commentAdmin: "ok",
                email: "a@a",
                pct: 20
                };
            const bills = await firebase.post(newBill)
            expect(getSpy).toHaveBeenCalledTimes(1)
            expect(bills.data.length).toBe(5)
        })
        test("fetches bills from an API and fails with 404 message error", async () => {
            firebase.post.mockImplementationOnce(() =>
            Promise.reject(new Error("Erreur 404"))
            )
            const html = BillsUI({ error: "Erreur 404" })
            document.body.innerHTML = html
            const message = await screen.getByText(/Erreur 404/)
            expect(message).toBeTruthy()
        })
        test("fetches messages from an API and fails with 500 message error", async () => {
            firebase.post.mockImplementationOnce(() =>
            Promise.reject(new Error("Erreur 500"))
            )
            const html = BillsUI({ error: "Erreur 500" })
            document.body.innerHTML = html
            const message = await screen.getByText(/Erreur 500/)
            expect(message).toBeTruthy()
        })
        })
    })