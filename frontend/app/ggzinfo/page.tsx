"use client";
import styles from "./page.module.css";
import React from "react";

const ggzInfo: string[] = [
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
        Aenean commodo ligula eget dolor.Aenean massa.Cum sociis \
        natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\
        Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. \
        Nulla consequat massa quis enim.Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.\
        In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.Nullam dictum felis eu pede mollis pretium.\
        Integer tincidunt.Cras dapibus.Vivamus elementum semper nisi. \
        Aenean vulputate eleifend tellus.Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.\
        Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. \
        Phasellus viverra nulla ut metus varius laoreet.Quisque rutrum. \
        Aenean imperdiet.Etiam ultricies nisi vel augue.Curabitur ullamcorper ultricies nisi.Nam eget dui.",

    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, \
        sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\
        Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.\
        Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,\
        vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent \
        luptatum zzril delenit augue duis dolore te feugait nulla facilisi.",

    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, \
        sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\
        Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.\
        Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,\
        vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent \
        luptatum zzril delenit augue duis dolore te feugait nulla facilisi.",

    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
        Aenean commodo ligula eget dolor.Aenean massa.Cum sociis \
        natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\
        Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. \
        Nulla consequat massa quis enim.Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.\
        In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.Nullam dictum felis eu pede mollis pretium.\
        Integer tincidunt.Cras dapibus.Vivamus elementum semper nisi. \
        Aenean vulputate eleifend tellus.Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.\
        Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. \
        Phasellus viverra nulla ut metus varius laoreet.Quisque rutrum. \
        Aenean imperdiet.Etiam ultricies nisi vel augue.Curabitur ullamcorper ultricies nisi.Nam eget dui.",
];

interface TextDisplayType {
    text: string; 
}
const DisplayInfo: React.FC<TextDisplayType> = ({ text }) => {

    return <p>{text}</p>;

};

export default DisplayInfo