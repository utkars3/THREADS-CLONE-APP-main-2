import { atom } from "recoil";


//jaise hi ye userpage me jaa rha hai saari ki saari user post aa jaa rhi hai isme kyuki waha p use effect laga hua hai aur phir action uske hisab s kaam kar rha hai
//jaise hi ham kisi post pe click kar denge to postpage wale page pe jate hi sirf ek single post ko array me daal dega kyuki waha p bhi use effect laga hua hai
const postsAtom = atom({
	key: "postsAtom",
	default: [],
});

export default postsAtom;