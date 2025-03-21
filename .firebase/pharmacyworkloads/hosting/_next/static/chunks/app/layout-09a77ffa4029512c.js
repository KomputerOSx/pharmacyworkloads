(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[177],{347:()=>{},4015:(e,r,i)=>{"use strict";i.d(r,{WorkloadProvider:()=>o});var t=i(5155),s=i(2115);let a=(0,s.createContext)(void 0),d=[{id:1,directorate:"COTE",ward:"Ward 1",pharmacist:"John Smith",shift:"AM",histories:12,reviews:25},{id:2,directorate:"COTE",ward:"Ward 1",pharmacist:"Emma Wilson",shift:"PM",histories:12,reviews:25},{id:3,directorate:"COTE",ward:"Ward 2",pharmacist:"John Smith",shift:"AM",histories:8,reviews:15},{id:4,directorate:"COTE",ward:"Ward 2",pharmacist:"John Smith",shift:"PM",histories:8,reviews:15},{id:5,directorate:"MEDS",ward:"Ward 5",pharmacist:"Emma Wilson",shift:"AM",histories:15,reviews:30},{id:6,directorate:"MEDS",ward:"Ward 5",pharmacist:"Sarah Johnson",shift:"PM",histories:15,reviews:30},{id:7,directorate:"MEDS",ward:"Ward 6",pharmacist:"Emma Wilson",shift:"AM",histories:10,reviews:22},{id:8,directorate:"MEDS",ward:"Ward 6",pharmacist:"Michael Brown",shift:"PM",histories:10,reviews:22},{id:9,directorate:"SURG",ward:"Ward 9",pharmacist:"Michael Brown",shift:"AM",histories:5,reviews:18},{id:10,directorate:"SURG",ward:"Ward 9",pharmacist:"Michael Brown",shift:"PM",histories:5,reviews:18},{id:11,directorate:"SURG",ward:"Ward 10",pharmacist:"Sarah Johnson",shift:"AM",histories:7,reviews:14},{id:12,directorate:"SURG",ward:"Ward 10",pharmacist:"Sarah Johnson",shift:"PM",histories:7,reviews:14},{id:13,directorate:"EMRG",ward:"Ward 13",pharmacist:"David Lee",shift:"AM",histories:20,reviews:35},{id:14,directorate:"EMRG",ward:"Ward 13",pharmacist:"David Lee",shift:"PM",histories:20,reviews:35},{id:15,directorate:"EMRG",ward:"Ward 14",pharmacist:"John Smith",shift:"AM",histories:9,reviews:19},{id:16,directorate:"EMRG",ward:"Ward 14",pharmacist:"David Lee",shift:"PM",histories:9,reviews:19}],o=e=>{let{children:r}=e,[i,o]=(0,s.useState)([]);return(0,s.useEffect)(()=>{o(d)},[]),(0,t.jsx)(a.Provider,{value:{entries:i,addEntry:e=>{let r={...e,id:Date.now()};o(e=>[...e,r])},updateEntry:(e,r)=>{o(i=>i.map(i=>i.id===e?{...i,...r}:i))},deleteEntry:e=>{o(r=>r.filter(r=>r.id!==e))},deleteWardEntries:(e,r)=>{o(i=>i.filter(i=>i.directorate!==e||i.ward!==r))},getDirectorateSummary:e=>{let r=i.filter(r=>r.directorate===e),t=r.reduce((e,r)=>e+r.histories,0),s=r.reduce((e,r)=>e+r.reviews,0);return{directorate:e,histories:t,reviews:s,total:t+s,wards:[...new Set(r.map(e=>e.ward))],pharmacists:[...new Set(r.map(e=>e.pharmacist))]}},getPharmacistSummary:e=>{let r=i.filter(r=>r.pharmacist===e),t=r.reduce((e,r)=>e+r.histories,0),s=r.reduce((e,r)=>e+r.reviews,0),a=[...new Set(r.map(e=>e.directorate))];return{pharmacist:e,histories:t,reviews:s,total:t+s,directorates:a,wards:[...new Set(r.map(e=>e.ward))],shifts:[...new Set(r.map(e=>e.shift))]}},getWardSummary:(e,r)=>{let t=i.filter(i=>i.directorate===e&&i.ward===r);if(0===t.length)return null;let s=t.find(e=>"AM"===e.shift),a=t.find(e=>"PM"===e.shift);return{ward:r,amPharmacist:(null==s?void 0:s.pharmacist)||"",pmPharmacist:(null==a?void 0:a.pharmacist)||"",histories:(null==s?void 0:s.histories)||(null==a?void 0:a.histories)||0,reviews:(null==s?void 0:s.reviews)||(null==a?void 0:a.reviews)||0,amId:null==s?void 0:s.id,pmId:null==a?void 0:a.id}},getAllEntries:()=>[...i],getFilteredEntries:(e,r)=>{let t=[...i];if(e&&"all"!==e&&(t=t.filter(r=>r.directorate===e)),r){let e=r.toLowerCase();t=t.filter(r=>r.ward.toLowerCase().includes(e)||r.pharmacist.toLowerCase().includes(e)||r.directorate.toLowerCase().includes(e))}return t}},children:r})}},4152:()=>{},7565:()=>{},8652:(e,r,i)=>{Promise.resolve().then(i.t.bind(i,4152,23)),Promise.resolve().then(i.t.bind(i,7565,23)),Promise.resolve().then(i.t.bind(i,347,23)),Promise.resolve().then(i.bind(i,6096)),Promise.resolve().then(i.bind(i,9949)),Promise.resolve().then(i.bind(i,1012)),Promise.resolve().then(i.bind(i,8209)),Promise.resolve().then(i.bind(i,4854)),Promise.resolve().then(i.bind(i,1356)),Promise.resolve().then(i.bind(i,4015))},9949:(e,r,i)=>{"use strict";i.d(r,{B:()=>o,EditModeProvider:()=>d});var t=i(5155),s=i(2115);let a=(0,s.createContext)(void 0);function d(e){let{children:r}=e,[i,d]=(0,s.useState)({COTE:!1,MEDS:!1,SURG:!1,EMRG:!1}),o=(0,s.useCallback)(()=>Object.values(i).some(e=>e),[i]),h=(0,s.useCallback)((e,r)=>{d(i=>i[e]===r?i:{...i,[e]:r})},[]);return(0,t.jsx)(a.Provider,{value:{directorateEditMode:i,isAnyDirectorateInEditMode:o,setDirectorateEditMode:h},children:r})}function o(){let e=(0,s.useContext)(a);if(void 0===e)throw Error("useEditMode must be used within an EditModeProvider");return e}}},e=>{var r=r=>e(e.s=r);e.O(0,[457,292,690,992,888,645,637,441,684,358],()=>r(8652)),_N_E=e.O()}]);