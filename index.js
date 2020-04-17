import createHomeScreen from "./components/homeScreen/homeScreenCreator.js";
import createLessonScreen from "./components/lessonScreen/lessonScreenCreator.js";

document.addEventListener("keypress", (event) => {
  if (event.code === "Space" && event.target === document.body) {
    event.preventDefault();
  }
});

document.addEventListener("focusin", (event) => {
  if (event.target.tagName === "BUTTON") {
    event.target.blur();
  }
});

const HomeScreen = createHomeScreen();
const LessonScreen = createLessonScreen();

HomeScreen.subscribe(LessonScreen.build);
HomeScreen.subscribe(LessonScreen.selectLesson);
HomeScreen.selectLesson(1);
HomeScreen.build();

LessonScreen.subscribe(HomeScreen.build);
LessonScreen.subscribe(HomeScreen.selectLesson);
