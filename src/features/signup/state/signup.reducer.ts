import { getNextStep, getPreviousStep } from "./signup.steps";
import type { SignupAction, SignupState } from "./signup.types";

export const initialSignupState: SignupState = {
  step: "email",
  data: {
    email: "",
    password: "",
    fullName: "",
    photoDataUrl: null,
    role: "",
    extraHelp: true,
    teamName: "",
    invites: ["", "", ""],
  },
};

/**
 * Pure reducer for the signup flow. No side effects, no React — easy to unit
 * test and reason about. Navigation goes through the linear step graph.
 */
export function signupReducer(
  state: SignupState,
  action: SignupAction,
): SignupState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, data: { ...state.data, email: action.email } };

    case "SET_PASSWORD":
      return { ...state, data: { ...state.data, password: action.password } };

    case "SET_FULL_NAME":
      return { ...state, data: { ...state.data, fullName: action.fullName } };

    case "SET_PHOTO":
      return {
        ...state,
        data: { ...state.data, photoDataUrl: action.photoDataUrl },
      };

    case "SET_ROLE":
      return { ...state, data: { ...state.data, role: action.role } };

    case "SET_EXTRA_HELP":
      return { ...state, data: { ...state.data, extraHelp: action.extraHelp } };

    case "SET_TEAM_NAME":
      return { ...state, data: { ...state.data, teamName: action.teamName } };

    case "SET_INVITE": {
      const invites = state.data.invites.map((value, i) =>
        i === action.index ? action.email : value,
      );
      return { ...state, data: { ...state.data, invites } };
    }

    case "ADD_INVITE_ROW":
      return {
        ...state,
        data: { ...state.data, invites: [...state.data.invites, ""] },
      };

    case "GO_TO":
      return { ...state, step: action.step };

    case "NEXT":
      return { ...state, step: getNextStep(state.step) };

    case "BACK":
      return { ...state, step: getPreviousStep(state.step) };

    default:
      return state;
  }
}
