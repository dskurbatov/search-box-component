(function(){
  const thisDoc = document.currentScript.ownerDocument
  class SearchBox extends HTMLElement {
    static get observedAttributes(){
      return ['size', 'color', 'text']
    }
    
    constructor() {
      super()
      this._size = 40;
      this._color = 'tomato'
      this._text = 'white'
      
      this.shadow = this.attachShadow({mode: 'open'})

      const tmpl = document.importNode(thisDoc.querySelector('template').content, true)

      this.shadow.appendChild(tmpl)
      addClickEvent(getElement(this.shadow, '.btn'), toggleClassToEl(this.shadow, 'form', 'open'))
    }
    
    get size() {
      return this._size
    }
    
    get color() {
      return this._color
    }
    
    get text() {
      return this._text
    }
    
    set size(value) {
      this.setAttribute('size', value)
    }
    
    set color(value) {
      this.setAttribute('color', value)
    }
    
    set text(value) {
      this.setAttribute('text', value)
    }
    
    attributeChangedCallback(name, oldVal, newVal){
      switch(name){
        case 'size':
          this._size = parseInt(newVal)
          setCSSVariables(this, name, newVal + 'px')
          break;
        case 'color':
          this._color = newVal
          setCSSVariables(this, name, newVal)
          break;
        case 'text':
          this._text = newVal
          setCSSVariables(this, name, newVal)
      }
    }
  
    connectedCallback(){
      console.log('connected') 
      this.shadow.querySelector('form').addEventListener('submit', function(e){
        e.preventDefault()
        
        const value = this.querySelector('input').value
        const url = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&limit=10&search=" + value
        
        fetch(url)
          .then(result => result.json())
          .then(data => {
            this.dispatchEvent(new CustomEvent('suggestions', {
              bubbles: true,
              composed: true,
              detail: data
            }))  
          })
      })
    }
  }
  
  customElements.define('search-box', SearchBox)

  function getElement(doc, el){
    return doc.querySelector(el)
  }
  
  function setCSSVariables(el, name, value){
    el.style.setProperty('--' + name, value)
  }
  
  function addClickEvent(el, cb){
    el.addEventListener('click', cb)
  }

  function toggleClassToEl(doc, elToFind, className) {
    const el = getElement(doc, elToFind)
    let input;
    return function(e){
      e.preventDefault()
      
      el.classList.toggle(className)
      
      if(className === 'open' && el.classList.contains(className)){
        if(!input){
          input = getElement(doc, 'input')
        }
        
        input.focus()
      } else {
        input.value = ""

        this.dispatchEvent(new CustomEvent('close', {
          bubbles: true,
          composed: true
        }))
      }
    }  
  }
})()