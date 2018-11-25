import "reflect-metadata";
import { Container } from "inversify";

import INVERSIFY_TYPES from "./inversify-types";
import { IRiotLibWrapper } from "../wrapper/IRiotLibWrapper";
import { KaynLib } from "../wrapper/KaynLib";

let container = new Container();
container.bind<IRiotLibWrapper>(INVERSIFY_TYPES.IRiotLibWrapper).to(KaynLib).inSingletonScope();

export default container;