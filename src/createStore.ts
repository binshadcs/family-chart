import CalculateTree from "./CalculateTree/CalculateTree.js"

interface Datum {
  id: number;
  [key: string]: any;
}

interface StoreState {
  data: Datum[];
  main_id: number | null;
  node_separation: number;
  level_separation: number;
  single_parent_empty_card: boolean;
  is_horizontal: boolean;
  one_level_rels: boolean;
  sortChildrenFunction?: (...args: any[]) => any;
  sortSpousesFunction?: (...args: any[]) => any;
  ancestry_depth?: number;
  progeny_depth?: number;
  show_siblings_of_main: boolean;
  modifyTreeHierarchy?: (...args: any[]) => any;
  private_cards_config?: any;
  duplicate_branch_toggle: boolean;
  tree?: any;
  main_id_history: number[];
  [key: string]: any;
}

interface Store {
  state: StoreState;
  updateTree: (props?: any) => void;
  updateData: (data: Datum[]) => void;
  updateMainId: (id: number) => void;
  getMainId: () => number | null;
  getData: () => Datum[];
  getTree: () => any;
  setOnUpdate: (f: (props?: any) => void) => void;
  getMainDatum: () => Datum | undefined;
  getDatum: (id: number) => Datum | undefined;
  getTreeMainDatum: () => any;
  getTreeDatum: (id: number) => any;
  getLastAvailableMainDatum: () => Datum | undefined;
  methods: Record<string, any>;
}

export default function createStore(initial_state: StoreState): Store {
  let onUpdate: ((props?: any) => void) | undefined;
  const state: StoreState = initial_state;
  state.main_id_history = [];

  const store: Store = {
    state,
    updateTree: (props) => {
      state.tree = calcTree();
      // main_id can legitimately be `0`; check for nullish instead of falsy
      if (state.main_id === null || state.main_id === undefined) updateMainId(state.tree.main_id)
      if (onUpdate) onUpdate(props)
    },
    updateData: (data) => (state.data = data),
    updateMainId,
    getMainId: () => state.main_id,
    getData: () => state.data,
    getTree: () => state.tree,
    setOnUpdate: (f) => (onUpdate = f),

    getMainDatum,
    getDatum,
    getTreeMainDatum,
    getTreeDatum,
    getLastAvailableMainDatum,

    methods: {},
  };

  return store;

  function calcTree() {
    return CalculateTree({
      data: state.data, main_id: state.main_id,
      node_separation: state.node_separation, level_separation: state.level_separation,
      single_parent_empty_card: state.single_parent_empty_card,
      is_horizontal: state.is_horizontal,
      one_level_rels: state.one_level_rels,
      sortChildrenFunction: state.sortChildrenFunction,
      sortSpousesFunction: state.sortSpousesFunction,
      ancestry_depth: state.ancestry_depth,
      progeny_depth: state.progeny_depth,
      show_siblings_of_main: state.show_siblings_of_main,
      modifyTreeHierarchy: state.modifyTreeHierarchy,
      private_cards_config: state.private_cards_config,
      duplicate_branch_toggle: state.duplicate_branch_toggle
    })
  }

  function getMainDatum() {
    return state.data.find(d => d.id === state.main_id)
  }

  function getDatum(id: number) {
    return state.data.find(d => d.id === id)
  }

  function getTreeMainDatum() {
    if (!state.tree) return null;
    return state.tree.data.find((d: any) => d.data.id === state.main_id)
  }

  function getTreeDatum(id: number) {
    if (!state.tree) return null;
    return state.tree.data.find((d: any) => d.data.id === id)
  }

  function updateMainId(id: number) {
    if (id === state.main_id) return
    state.main_id_history = state.main_id_history.filter(d => d !== id).slice(-10)
    state.main_id_history.push(id)
    state.main_id = id
  }

  // if main_id is deleted, get the last available main_id
  function getLastAvailableMainDatum() {
    let main_id = state.main_id_history.slice(0).reverse().find(id => getDatum(id))
    if (!main_id) main_id = state.data[0].id
    if (main_id !== state.main_id) updateMainId(main_id)
    return getDatum(main_id)
  }
}