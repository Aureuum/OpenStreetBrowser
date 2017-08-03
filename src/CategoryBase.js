function CategoryBase (id, data) {
  this.id = id
  this.parentCategory = null
  this.childrenLoadingCount = 0
  this.data = data
  this.isOpen = false
  this.dom = document.createElement('div')
  this.dom.className = 'category category-' + data.type
  var name

  if (this.id !== 'index') {
    var domHeader = document.createElement('header')
    this.dom.appendChild(domHeader)

    if ('name' in this.data) {
      if (typeof this.data.name === 'object') {
        name = lang(this.data.name)
      } else {
        name = this.data.name
      }
    } else if (('name:' + ui_lang) in this.data) {
      name = this.data['name:' + ui_lang]
    } else {
      name = lang('category:' + this.id)
    }

    var a = document.createElement('a')
    a.appendChild(document.createTextNode(name))
    a.href = '#'
    a.onclick = this.toggle.bind(this)
    domHeader.appendChild(a)
  }

  this.domContent = document.createElement('div')
  this.domContent.className = 'content'
  this.dom.appendChild(this.domContent)
}

CategoryBase.prototype.setMap = function (map) {
  this.map = map
}

CategoryBase.prototype.setParent = function (parent) {
  this.parentCategory = parent
}

CategoryBase.prototype.setParentDom = function (parentDom) {
  this.parentDom = parentDom
  if (typeof this.parentDom !== 'string') {
    this.parentDom.appendChild(this.dom)

    if (this.isOpen) {
      this.parentDom.parentNode.classList.add('open')
    }
  }
}

CategoryBase.prototype.open = function () {
  if (this.isOpen)
    return

  if (this.parent) {
    this.parent.open()
  }

  if (typeof this.parentDom === 'string') {
    var d = document.getElementById(this.parentDom)
    if (d) {
      this.parentDom = d
      this.parentDom.appendChild(this.dom)
    }
  }

  this.dom.classList.add('open')

  this.isOpen = true
}

CategoryBase.prototype.close = function () {
  if (!this.isOpen)
    return

  this.dom.classList.remove('open')

  this.isOpen = false
}

CategoryBase.prototype.toggle = function () {
  if (this.isOpen) {
    this.close()
  } else {
    this.open()
  }

  return false
}

CategoryBase.prototype.recalc = function () {
}

CategoryBase.prototype.notifyChildLoadStart = function (category) {
  console.log(this.id, this.childrenLoadingCount)
  if (this.childrenLoadingCount === 0 && this.parentCategory) {
    this.parentCategory.notifyChildLoadStart(this)
  } else {
    document.body.classList.add('loading')
  }
  this.childrenLoadingCount++
}

CategoryBase.prototype.notifyChildLoadEnd = function (category) {
  console.log(this.id, this.childrenLoadingCount)
  this.childrenLoadingCount--
  if (this.childrenLoadingCount === 0 && this.parentCategory) {
    this.parentCategory.notifyChildLoadEnd(this)
  } else {
    document.body.classList.remove('loading')
  }
}

module.exports = CategoryBase
