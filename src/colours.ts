import { LiturgicalColour } from "./libs.ts";

export const getHexColour = (colour: LiturgicalColour): string => {
    switch (colour) {
        case LiturgicalColour.COLOUR_RED:
            return "d80707";
        case LiturgicalColour.COLOUR_WHITE:
            return "FFD700";
        case LiturgicalColour.COLOUR_GREEN:
            return "186420";
        case LiturgicalColour.COLOUR_VIOLET:
            return "4B0082";
        case LiturgicalColour.COLOUR_VIOLET_OR_BLUE:
            return "0000F9";
        case LiturgicalColour.COLOUR_BLACK:
            return "ffffff";
        case LiturgicalColour.COLOUR_ROSE:
            return "f485ba";
    }
};
