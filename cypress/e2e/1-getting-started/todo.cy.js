/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('example to-do app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('https://example.cypress.io/todo')
  })

  it('displays two todo items by default', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.

    // 取得css為.todo-list 且子元素標籤為li，並檢查是否有兩個
    cy.get('.todo-list > li').should('have.length', 2)
    // > 代表取得子元素，一定只能是下一層不能是更下層 
    // 只能取得li不能直接取得div會報錯
    // ex: <ul class="todo-list"><li><div></div>></li></ul>  
    // true cy.get('.todo-list > li') 
    // false cy.get('.todo-list > div') 會報錯
    // 子元素可以是 id、class、標籤、標籤屬性的值
    cy.get('.todo-list > li:first > div > [type="checkbox"]:first').should('have.length', 1)
    // We can go even further and check that the default todos each contain
    // the correct text. We use the `first` and `last` functions
    // to get just the first and last matched elements individually,
    // and then perform an assertion with `should`.
    // have.text 需要完全相同
    cy.get('.todo-list li:first').should('have.text', 'Pay electric bill')
    cy.get('.todo-list li').last().should('have.text', 'Walk the dog')
  })

  it('can add new todo items', () => {
    // We'll store our item text in a variable so we can reuse it
    const newItem = 'Feed the cat'

    // Let's get the input element and use the `type` command to
    // input our new list item. After typing the content of our item,
    // we need to type the enter key as well in order to submit the input.
    // This input has a data-test attribute so we'll use that to select the
    // element in accordance with best practices:
    // https://on.cypress.io/selecting-elements
    
    // 不帶前後綴代表取得標籤 ex: <input>                func: cy.get('input')
    // [] 標籤屬性的值 ex: <input data-test="new-todo"> func: cy.get('[data-test=new-todo]')
    // # 代表取得id    ex: <input id="new-todo">        func: cy.get('#new-todo')
    // . 代表取得class ex: <input class="new-todo">     func: cy.get('.new-todo')
    // {enter} 代表按下enter 
     // type "hello" + press Enter = cy.get('input').type('hello{enter}')
     // 注意如果使用變數要用``包起來
     // type api 請參考 https://docs.cypress.io/api/commands/type.html
     // https://docs.cypress.io/api/commands/type#Arguments
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)

    // Now that we've typed our new item, let's check that it actually was added to the list.
    // Since it's the newest item, it should exist as the last element in the list.
    // In addition, with the two default items, we should have a total of 3 elements in the list.
    // Since assertions yield the element that was asserted on,
    // we can chain both of these assertions together into a single statement.
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
  })

  it('can check off an item as completed', () => {
    // In addition to using the `get` command to get an element by selector,
    // we can also use the `contains` command to get an element by its contents.
    // However, this will yield the <label>, which is lowest-level element that contains the text.
    // In order to check the item, we'll find the <input> element for this <label>
    // by traversing up the dom to the parent element. From there, we can `find`
    // the child checkbox <input> element and use the `check` command to check it.
    // contains api 請參考 https://docs.cypress.io/api/commands/contains.html
    // parents api 請參考 https://docs.cypress.io/api/commands/parents.html              
    cy.contains('Pay electric bill')
      .parent()
      .find('input[type=checkbox]')
      .check()

    // Now that we've checked the button, we can go ahead and make sure
    // that the list element is now marked as completed.
    // Again we'll use `contains` to find the <label> element and then use the `parents` command
    // to traverse multiple levels up the dom until we find the corresponding <li> element.
    // Once we get that element, we can assert that it has the completed class.
    cy.contains('Pay electric')
      .parents('li')
      .should('have.class', 'completed')
  })

  context('with a checked task', () => {
    // context 也可以有 beforeEach
    beforeEach(() => {
      // We'll take the command we used above to check off an element
      // Since we want to perform multiple tests that start with checking
      // one element, we put it in the beforeEach hook
      // so that it runs at the start of every test.
      cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check()
    })

    it('can filter for uncompleted tasks', () => {
      // We'll click on the "active" button in order to
      // display only incomplete items
      // 回傳 <a> 標籤 並且有 Active 這個字
      cy.contains('Active').click()
      // After filtering, we can assert that there is only the one
      // incomplete item in the list.
      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Walk the dog')

      // For good measure, let's also assert that the task we checked off
      // does not exist on the page.
      cy.contains('Pay electric bill').should('not.exist')
    })

    it('can filter for completed tasks', () => {
      // We can perform similar steps as the test above to ensure
      // that only completed tasks are shown
      cy.contains('Completed').click()

      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Pay electric bill')

      cy.contains('Walk the dog').should('not.exist')
    })

    it('can delete all completed tasks', () => {
      // First, let's click the "Clear completed" button
      // `contains` is actually serving two purposes here.
      // First, it's ensuring that the button exists within the dom.
      // This button only appears when at least one task is checked
      // so this command is implicitly verifying that it does exist.
      // Second, it selects the button so we can click it.
      cy.contains('Clear completed').click()

      // Then we can make sure that there is only one element
      // in the list and our element does not exist
      cy.get('.todo-list li')
        .should('have.length', 1)
        .should('not.have.text', 'Pay electric bill')

      // Finally, make sure that the clear button no longer exists.
      // 如果contains 後面接should 代表是檢查該元素是否存在
      cy.contains('Clear completed').should('not.exist')
    })
  })
})
