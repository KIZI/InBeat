switch (interaction.attributes.action) {
    case "play":
        aggregation.interest = 0.01;
        break;
    case "seek+":
        aggregation.interest = -0.5;
        break;
    case "seek-":
        aggregation.interest = 0.5;
        break;
    case "bookmark":
        aggregation.interest = 1;
        break;
    case "detail":
        aggregation.interest = 1;
        break;
    case "looking":
        if (interaction.attributes.value === "0") {
            aggregation.interest = -1;
        } else {
            aggregation.interest = 0;
        }
        break;
    case "viewer_looking":
        if (interaction.attributes.value === "0") {
            aggregation.interest = -1;
        } else {
            aggregation.interest = 0;
        }
        break;
    case "volume+":
        aggregation.interest = 0.5;
        break;
    case "volume-":
        aggregation.interest = -0.1;
        break;
    default:
        aggregation.interest = 0;
        break;
}