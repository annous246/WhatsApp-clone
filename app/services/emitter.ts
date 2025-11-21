import mitt from "mitt";

type Events = {
  notify: { message: string; type: number };
};
type GoalEvents = {
  newGoal: {};
};

const emitter = mitt<Events>();
const goalsEmitter = mitt<GoalEvents>();

export { emitter, goalsEmitter };
