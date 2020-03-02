// set the map menu to the correct size
// based on width of leaflet-container, not screen size

// window.onresize = function(event) {
//   checkMapSize();
// };

// $(document).ready(() => {
//   checkMapSize(); // on page load
// });

// function checkMapSize() {
//   Array.from(document.getElementsByClassName("leaflet-container")).forEach((mapobj) => {
//     setMapSize(mapobj, mapobj.offsetWidth);
//   })
// }

// function setMapSize(mapobj, width) {
//   var mapSizeArray = [
//     ['xs', 0, 380],
//     ['sm', 380, 590],
//     ['md', 590, 880],
//     ['lg', 880, 10000]
//   ];

//   mapSizeArray.forEach((sizeMinMax) => {
//     if(width >= sizeMinMax[1] && width < sizeMinMax[2]) {
//       mapobj.classList.add(sizeMinMax[0]);
//     } else {
//       mapobj.classList.remove(sizeMinMax[0]);
//     }
//   });
// }
