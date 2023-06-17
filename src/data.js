import Pat from "./images/Bihar-Jharkhand/Pat1.jpg";
import Pat2 from "./images/Bihar-Jharkhand/Pat2.jpg";
import Mul from "./images/Mullayanagiri.jpg";
import Ris from "./images/Rishikesh.jpg";
import Mus from "./images/Mussoorie.jpg";
const data = [
  {
    id: 1,
    photo:Pat,
    location: "Bihar-Jharkhand",
    state: "BIHAR",
    date: "JULY 30, 2021",
    link: "https://www.google.com/maps/place/Patna,+Bihar/@25.6077067,84.8311991,11z/data=!3m1!4b1!4m6!3m5!1s0x39f29937c52d4f05:0x831a0e05f607b270!8m2!3d25.5940947!4d85.1375645!16zL20vMDI3d3Zi",
    des:
      "Patna is an ancient city that sprawls along the south bank of the Ganges River in Bihar, northeast India." +
      "The state capital, it’s home to Bihar Museum, a contemporary landmark exhibiting bronze sculptures and old coins from the region." +
      "Nearby, Indo-Saracenic–style Patna Museum displays a casket believed to contain the Buddha’s ashes." +
      "Close to the river, the Golghar is a domed colonial granary overlooking the city.",
      allphotos:[Pat,Pat2]
  },
  {
    id: 2,
    photo: [Mul],
    location: "Mullayanagiri",
    state: "KARNATAKA",
    date: "JULY 4, 2020",
    link: "https://www.google.com/maps/place/Mullayanagiri,+Karnataka+577130/@13.3898724,75.7089862,15z/data=!3m1!4b1!4m6!3m5!1s0x3bbad8a185c5057b:0x4908b0ecd88ab6b9!8m2!3d13.3898729!4d75.7192859!16s%2Fg%2F11fn1djv44",
    des:
      "Mullayyanagiri is the highest peak in Karnataka, India." +
      "Mullayyanagiri is located in the Chandra Dhrona Hill Ranges of the Western Ghats of Chikkamagaluru Taluk." +
      "With a height of 1,925 metres, it is the highest peak in Karnataka and also the 23rd highest peak in Western Ghats.",
  },
  {
    id: 3,
    photo: [Ris],
    location: "Rishikesh",
    state: "UTTARAKHAND",
    date: "JULY 29, 2019",
    link: "https://www.google.com/maps/place/Rishikesh,+Uttarakhand/@30.0876723,78.2294091,13z/data=!3m1!4b1!4m6!3m5!1s0x39093e67cf93f111:0xcc78804a6f941bfe!8m2!3d30.0869281!4d78.2676116!16zL20vMGNjdHZz",
    des:
      "Rishikesh is a city in India’s northern state of Uttarakhand, in the Himalayan foothills beside the Ganges River." +
      "The river is considered holy, and the city is renowned as a center for studying yoga and meditation." +
      "Temples and ashrams line the eastern bank around Swarg Ashram, a traffic-free, alcohol-free and vegetarian enclave upstream from Rishikesh town.",
  },
  {
    id: 4,
    photo: [Mus],
    location: "Mussoorie",
    state: "UTTARAKHAND",
    date: "AUGUST 10, 2020",
    link: "https://www.google.com/maps/place/Mussoorie,+Uttarakhand/@30.4547217,78.0558405,14z/data=!3m1!4b1!4m6!3m5!1s0x3908d0cfa61cda5b:0x197fd47d980e85b1!8m2!3d30.4597892!4d78.0643723!16zL20vMDU0Mjlq",
    des:
      "Mussoorie is a hill station and a municipal board, near Dehradun city in the Dehradun district of the Indian state Uttarakhand." +
      "It is about 35 kilometres from the state capital of Dehradun and 290 km north of the national capital of New Delhi." +
      "The hill station is in the foothills of the Garhwal Himalayan range.",
  },
];
export default data;