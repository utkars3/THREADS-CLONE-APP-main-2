import { atom } from "recoil";

const authScreenAtom=atom({
    key:'authScreenAtom',                       //needed to differentiate
    default:'login'                                //by default we want a login page
})

export default authScreenAtom;