class A {
  constructor () {
    this.x = 1
  }
}

class B extends A {
  constructor () {
    super()
    this.x = 2
    super.x = 3
    console.log(super.x)
    console.log(this.x)
  }
}

new B()