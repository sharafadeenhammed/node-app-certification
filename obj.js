// const name = String("hammed")
function person(name,age){
    this.name = name;
    this.age = age;
}

// console.log( Object.getPrototypeOf(hammed));
person.prototype = {
    getName:function(){
        return this.name
    },
    getAge:function(){
        return this.age
    }
}

const hammed = new person("hammed",25);
// console.log( Object.getPrototypeOf(hammed));
console.log(hammed)
