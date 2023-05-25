alertBtn = () => alert("The Button is Clicked");

const eventBtn = document.querySelector("button");

// eventBtn.onclick = alertBtn;

eventBtn.addEventListener("click", (event) =>
  console.log("The Button is Clicked")
);

function randomBetween(min, max) {
  // 5 10
  return Math.random() * (max - min) + min;
}

/**************************************************** */
// ******  Synchronous & Asynchronous Code  ****** //
// console.log(randomBetween(1,0).toFixed());

// console.log(`first message`);

// setTimeout((_) => {
//   console.log(`This from SetTimeout!!`);
// }, 2_000);

// console.log(`2nd message`);

// const frstLoop = () => {
//   for (let i = 0; i < 10_000; i++) {
//     console.log("first Loop");
//   }
// };

// const scndLoop = () => {
//   for (let i = 0; i < 20_000; i++) {
//     console.log("second Loop");
//   }
// };

// frstLoop();
// scndLoop();
