import { screen } from "@testing-library/dom"
import VerticalLayout from "../views/VerticalLayout"
import { localStorageMock } from "../__mocks__/localStorage.js"
import router from "../app/Router.js"


describe('Given I am connected as Employee', () => {
  test("Then Icons should be rendered", async() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    const user = JSON.stringify({
      type: 'Employee'
    })
    window.localStorage.setItem('user', user)
    jest.mock("../containers/Bills.js", () => {
      return jest.fn().mockImplementation(function () {
        return {
          getBills: async function () {
            return [];
          },
        };
      });
    });

    window.location.hash = "#employee/bills";
    document.body.innerHTML = `<div id='root'></div>`;
    router();
    expect(screen.getByTestId('icon-window')).toBeTruthy()
    expect(screen.getByTestId('icon-mail')).toBeTruthy()
  })

  test("Then bill icon in vertical layout should be highlighted", async() => {
    // connected as an employee
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    const user = JSON.stringify({
      type: 'Employee'
    })
    window.localStorage.setItem('user', user)
    const firestoreStorage = firebase
    
/*     jest.mock("../containers/Bills.js", () => {
      return jest.fn().mockImplementation(function () {
        return {
          getBills: async function () {
            return [];
            //return firestoreStorage.get()
          },
        };
      });
    }); */
    

    window.location.hash = "#employee/bills";
    document.body.innerHTML = `<div id='root'></div>`;

    const verticalLayout = VerticalLayout(120)
    expect(verticalLayout).toBeTruthy()
    router();
    const iconContainer = screen.queryByTestId('icon-window')
    expect(iconContainer.classList.contains('active-icon')).toBe(true)
    
  })

})
