// How-to notes for every exercise the Basic program uses. Written in our own
// words from "You Are Your Own Gym" — `page` is the book page to look up for
// the photos.

export interface ExerciseGuide {
  title: string;
  muscles: string;
  steps: string[];
  // Notes on the easier/harder versions the program asks for (e.g. "w/hands
  // elevated", "w/knees bent").
  variations?: string[];
  // The book page with the photos. Leave it out unless the page is known —
  // never guess.
  page?: number;
}
