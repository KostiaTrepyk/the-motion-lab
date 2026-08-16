import { findNodeById } from "../lib/tree";
import type { AnimatePresenceNode, CanvasNode, DivNode, MotionDivNode, TextNode } from "../types/nodes";
import { labStoreActions } from "./actions";
import { useLabStore } from "./store";

// --- Утилиты для создания тестовых узлов ---
const createDivNode = (id: string, children: CanvasNode[] = []): DivNode => ({
	id,
	type: "div",
	name: "Div Node",
	props: { className: "initial-class" },
	children,
});

const createTextNode = (id: string, content: string = "Text"): TextNode => ({
	id,
	type: "text",
	name: "Text Node",
	content,
});

const createMotionNode = (id: string): MotionDivNode => ({
	id,
	type: "motion.div",
	name: "Motion Node",
	props: { initial: { opacity: 0 } },
	children: [],
});

describe("labStoreActions", () => {
	// Очищаем Zustand-стор перед каждым тестом
	beforeEach(() => {
		useLabStore.setState({
			nodes: [],
			selectedNodeId: null,
			past: [],
			future: [],
		});
	});

	describe("findNodeById (Pure Utility)", () => {
		it("должен находить узел в корне", () => {
			const rootNode = createDivNode("1");
			const result = findNodeById([rootNode], "1");
			expect(result).toEqual(rootNode);
		});

		it("должен находить глубоко вложенный узел", () => {
			const targetNode = createTextNode("target");
			const rootNode = createDivNode("root", [createDivNode("child-1", [targetNode])]);

			const result = findNodeById([rootNode], "target");
			expect(result).toEqual(targetNode);
		});

		it("должен возвращать undefined, если узел не найден", () => {
			const rootNode = createDivNode("1");
			const result = findNodeById([rootNode], "unknown");
			expect(result).toBeUndefined();
		});
	});

	describe("changeSelectedNode", () => {
		it("должен обновлять selectedNodeId", () => {
			labStoreActions.changeSelectedNode("node-123");
			expect(useLabStore.getState().selectedNodeId).toBe("node-123");

			labStoreActions.changeSelectedNode(null);
			expect(useLabStore.getState().selectedNodeId).toBeNull();
		});
	});

	describe("addNode", () => {
		it("должен добавлять узел в корень, если parentId не передан", () => {
			const newNode = createDivNode("new-1");
			labStoreActions.addNode(newNode);

			const state = useLabStore.getState();
			expect(state.nodes).toHaveLength(1);
			expect(state.nodes[0].id).toBe("new-1");
		});

		it("должен добавлять узел в children существующего родителя", () => {
			const parentNode = createDivNode("parent");
			useLabStore.setState({ nodes: [parentNode] });

			const childNode = createTextNode("child");
			labStoreActions.addNode(childNode, "parent");

			const state = useLabStore.getState();
			const parentInStore = state.nodes[0] as DivNode;

			expect(parentInStore.children).toHaveLength(1);
			expect(parentInStore.children[0].id).toBe("child");
		});

		it("должен добавлять узел в корень (с предупреждением), если родитель не поддерживает детей (TextNode)", () => {
			const textNode = createTextNode("text-parent");
			useLabStore.setState({ nodes: [textNode] });

			// Подавляем console.warn на время теста, чтобы не засорять консоль
			const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

			const childNode = createDivNode("child");
			labStoreActions.addNode(childNode, "text-parent");

			const state = useLabStore.getState();

			// Узел должен был упасть в корень, а не в textNode
			expect(state.nodes).toHaveLength(2);
			expect(state.nodes[1].id).toBe("child");

			warnSpy.mockRestore();
		});
	});

	describe("removeNode", () => {
		it("должен удалять корневой узел", () => {
			useLabStore.setState({ nodes: [createDivNode("1"), createDivNode("2")] });

			labStoreActions.removeNode("1");

			const state = useLabStore.getState();
			expect(state.nodes).toHaveLength(1);
			expect(state.nodes[0].id).toBe("2");
		});

		it("должен удалять глубоко вложенный узел", () => {
			const rootNode = createDivNode("root", [createDivNode("child", [createTextNode("grandchild")])]);
			useLabStore.setState({ nodes: [rootNode] });

			labStoreActions.removeNode("grandchild");

			const state = useLabStore.getState();
			const rootInStore = state.nodes[0] as DivNode;
			const childInStore = rootInStore.children[0] as DivNode;

			expect(childInStore.children).toHaveLength(0);
		});

		it("должен сбрасывать selectedNodeId, если удаляется выделенный узел", () => {
			useLabStore.setState({
				nodes: [createDivNode("target")],
				selectedNodeId: "target",
			});

			labStoreActions.removeNode("target");

			expect(useLabStore.getState().selectedNodeId).toBeNull();
		});

		it("не должен сбрасывать selectedNodeId, если удаляется другой узел", () => {
			useLabStore.setState({
				nodes: [createDivNode("target"), createDivNode("other")],
				selectedNodeId: "target",
			});

			labStoreActions.removeNode("other");

			expect(useLabStore.getState().selectedNodeId).toBe("target");
		});
	});

	describe("updateNodeContent", () => {
		it("должен обновлять контент только для TextNode", () => {
			useLabStore.setState({ nodes: [createTextNode("text-1", "Old Text")] });

			labStoreActions.updateNodeContent("text-1", "New Text");

			const state = useLabStore.getState();
			const node = state.nodes[0] as TextNode;
			expect(node.content).toBe("New Text");
		});
	});

	describe("updateNodeProps", () => {
		it("должен обновлять свойства DivNode (shallow merge)", () => {
			useLabStore.setState({ nodes: [createDivNode("div-1")] });

			labStoreActions.updateNodeProps("div-1", {
				type: "div",
				props: { className: "new-class" },
			});

			const state = useLabStore.getState();
			const node = state.nodes[0] as DivNode;
			expect(node.props.className).toBe("new-class");
		});

		it("должен обновлять свойства MotionDivNode", () => {
			useLabStore.setState({ nodes: [createMotionNode("motion-1")] });

			labStoreActions.updateNodeProps("motion-1", {
				type: "motion.div",
				props: { animate: { opacity: 1 } },
			});

			const state = useLabStore.getState();
			const node = state.nodes[0] as MotionDivNode;

			// Проверяем, что старое свойство initial осталось, а animate добавилось
			expect(node.props.initial).toEqual({ opacity: 0 });
			expect(node.props.animate).toEqual({ opacity: 1 });
		});

		it("не должен обновлять пропсы, если передан неверный type (Type Safety)", () => {
			useLabStore.setState({ nodes: [createDivNode("div-1")] });

			// Пытаемся обновить обычный div, передав payload от motion.div
			labStoreActions.updateNodeProps("div-1", {
				type: "motion.div",
				props: { animate: { opacity: 1 } },
			});

			const state = useLabStore.getState();
			const node = state.nodes[0] as DivNode;

			// Пропсы не должны были измениться, защита в action должна сработать
			expect(node.props).not.toHaveProperty("animate");
		});

		it("должен обновлять свойства AnimatePresenceNode", () => {
			useLabStore.setState({
				nodes: [
					{ id: "presence-1", type: "AnimatePresence", name: "AP", props: { mode: "wait" }, children: [] },
				],
			});

			labStoreActions.updateNodeProps("presence-1", {
				type: "AnimatePresence",
				props: { mode: "popLayout" },
			});

			const state = useLabStore.getState();
			const node = state.nodes[0] as AnimatePresenceNode;
			expect(node.props.mode).toBe("popLayout");
		});

		it("должен делать ГЛУБОКИЙ мердж для вложенных объектов (animate, initial)", () => {
			const motionNode = createMotionNode("motion-1");
			// Задаем изначальное состояние, где в animate есть scale
			motionNode.props.animate = { scale: 0.5, opacity: 0 };
			useLabStore.setState({ nodes: [motionNode] });

			// Пытаемся обновить ТОЛЬКО opacity
			labStoreActions.updateNodeProps("motion-1", {
				type: "motion.div",
				props: { animate: { opacity: 1 } },
			});

			const state = useLabStore.getState();
			const node = state.nodes[0] as MotionDivNode;

			expect(node.props.animate).toHaveProperty("scale", 0.5);
			expect(node.props.animate).toHaveProperty("opacity", 1);
		});

		it("должен полностью удалять свойство при передаче undefined", () => {
			const motionNode = createMotionNode("motion-1");
			motionNode.props.initial = { opacity: 0 };
			motionNode.props.whileHover = { scale: 1.1 };
			useLabStore.setState({ nodes: [motionNode] });

			labStoreActions.updateNodeProps("motion-1", {
				type: "motion.div",
				props: { initial: undefined, whileHover: undefined },
			});

			const state = useLabStore.getState();
			const node = state.nodes[0] as MotionDivNode;

			expect(node.props).not.toHaveProperty("initial");
			expect(node.props).not.toHaveProperty("whileHover");
		});

		it("должен делать глубокий мердж для объекта style и сохранять существующие стили", () => {
			const divNode = createDivNode("div-1");
			divNode.props.style = { width: "100px", backgroundColor: "#ffffff" };
			divNode.props.className = "flex justify-between";
			useLabStore.setState({ nodes: [divNode] });

			labStoreActions.updateNodeProps("div-1", {
				type: "div",
				props: { style: { height: "200px" } },
			});

			const state = useLabStore.getState();
			const node = state.nodes[0] as DivNode;

			expect(node.props.style).toEqual({
				width: "100px",
				backgroundColor: "#ffffff",
				height: "200px",
			});
			expect(node.props.className).toBe("flex justify-between");
		});
	});

	describe("updateNodeStyle", () => {
		it("должен обновлять style объекта и сохранять className нетронутым", () => {
			const divNode = createDivNode("div-1");
			divNode.props.style = { width: "50px" };
			divNode.props.className = "p-4 font-bold";
			useLabStore.setState({ nodes: [divNode] });

			labStoreActions.updateNodeStyle("div-1", { height: "50px", backgroundColor: "red" });

			const state = useLabStore.getState();
			const node = state.nodes[0] as DivNode;

			expect(node.props.style).toEqual({
				width: "50px",
				height: "50px",
				backgroundColor: "red",
			});
			expect(node.props.className).toBe("p-4 font-bold");
		});

		it("должен удалять свойство из style при передаче пустой строки", () => {
			const divNode = createDivNode("div-1");
			divNode.props.style = { width: "100px", borderRadius: "8px" };
			useLabStore.setState({ nodes: [divNode] });

			labStoreActions.updateNodeStyle("div-1", { borderRadius: "" });

			const state = useLabStore.getState();
			const node = state.nodes[0] as DivNode;

			expect(node.props.style).toEqual({ width: "100px" });
			expect(node.props.style).not.toHaveProperty("borderRadius");
		});
	});

	describe("removeMotionProperty", () => {
		it("должен удалять конкретное свойство из motion-объекта (например opacity из animate)", () => {
			const motionNode = createMotionNode("motion-1");
			motionNode.props.animate = { opacity: 1, scale: 1.2, x: "10px" };
			useLabStore.setState({ nodes: [motionNode] });

			labStoreActions.removeMotionProperty("motion-1", "animate", "opacity");

			const state = useLabStore.getState();
			const node = state.nodes[0] as MotionDivNode;

			expect(node.props.animate).toEqual({ scale: 1.2, x: "10px" });
			expect(node.props.animate).not.toHaveProperty("opacity");
		});
	});

	describe("moveNode", () => {
		it("должен перемещать узел перед другим корневым узлом", () => {
			useLabStore.setState({
				nodes: [createDivNode("node-1"), createDivNode("node-2")],
			});

			labStoreActions.moveNode("node-2", "node-1", "before");

			const state = useLabStore.getState();
			expect(state.nodes.map((n) => n.id)).toEqual(["node-2", "node-1"]);
		});

		it("должен перемещать узел после другого корневого узла", () => {
			useLabStore.setState({
				nodes: [createDivNode("node-1"), createDivNode("node-2")],
			});

			labStoreActions.moveNode("node-1", "node-2", "after");

			const state = useLabStore.getState();
			expect(state.nodes.map((n) => n.id)).toEqual(["node-2", "node-1"]);
		});

		it("должен перемещать узел внутрь контейнера", () => {
			useLabStore.setState({
				nodes: [createDivNode("parent"), createTextNode("child")],
			});

			labStoreActions.moveNode("child", "parent", "inside");

			const state = useLabStore.getState();
			expect(state.nodes).toHaveLength(1);
			expect(state.nodes[0].id).toBe("parent");
			expect((state.nodes[0] as DivNode).children.map((c) => c.id)).toEqual(["child"]);
		});

		it("не должен позволять перемещать узел в самого себя", () => {
			useLabStore.setState({
				nodes: [createDivNode("node-1")],
			});

			labStoreActions.moveNode("node-1", "node-1", "before");

			const state = useLabStore.getState();
			expect(state.nodes.map((n) => n.id)).toEqual(["node-1"]);
		});

		it("не должен позволять перемещать родительский узел внутрь своего потомка (предотвращение цикла)", () => {
			const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
			const child = createDivNode("child");
			const parent = createDivNode("parent", [child]);

			useLabStore.setState({
				nodes: [parent],
			});

			labStoreActions.moveNode("parent", "child", "inside");

			const state = useLabStore.getState();
			// Структура должна остаться неизменной
			expect(state.nodes).toHaveLength(1);
			expect(state.nodes[0].id).toBe("parent");
			expect((state.nodes[0] as DivNode).children).toHaveLength(1);
			expect((state.nodes[0] as DivNode).children[0].id).toBe("child");

			expect(warnSpy).toHaveBeenCalledWith("Cannot move a parent node into its own descendant.");
			warnSpy.mockRestore();
		});
	});

	describe("undo & redo", () => {
		it("должен сохранять историю при добавлении узла и восстанавливать состояние при undo", () => {
			const node1 = createDivNode("node-1");
			labStoreActions.addNode(node1);

			expect(useLabStore.getState().nodes).toHaveLength(1);
			expect(useLabStore.getState().past).toHaveLength(1);

			labStoreActions.undo();

			expect(useLabStore.getState().nodes).toHaveLength(0);
			expect(useLabStore.getState().future).toHaveLength(1);
		});

		it("должен выполнять redo после undo", () => {
			const node1 = createDivNode("node-1");
			labStoreActions.addNode(node1);

			labStoreActions.undo();
			expect(useLabStore.getState().nodes).toHaveLength(0);

			labStoreActions.redo();
			expect(useLabStore.getState().nodes).toHaveLength(1);
			expect(useLabStore.getState().nodes[0].id).toBe("node-1");
		});

		it("должен очищать future при новом действии после undo", () => {
			labStoreActions.addNode(createDivNode("node-1"));
			labStoreActions.undo();
			expect(useLabStore.getState().future).toHaveLength(1);

			labStoreActions.addNode(createDivNode("node-2"));
			expect(useLabStore.getState().future).toHaveLength(0);
		});
	});
});
