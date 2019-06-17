import uuid from "uuid/v4";
import * as types from "./actionTypes";
import loadProjectData from "../lib/project/loadProjectData";
import saveProjectData from "../lib/project/saveProjectData";
import { loadSpriteData } from "../lib/project/loadSpriteData";
import { loadBackgroundData } from "../lib/project/loadBackgroundData";
import { loadMusicData } from "../lib/project/loadMusicData";
import {
  DRAG_PLAYER,
  DRAG_DESTINATION,
  DRAG_TRIGGER,
  DRAG_ACTOR
} from "../reducers/editorReducer";

const asyncAction = async (
  dispatch,
  requestType,
  successType,
  failureType,
  fn
) => {
  dispatch({ type: requestType });
  try {
    const res = await fn();
    dispatch({ ...res, type: successType });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    dispatch({ type: failureType });
  }
};

export const resizeSidebar = width => {
  return {
    type: types.SIDEBAR_RESIZE,
    width
  };
};

export const loadProject = path => async dispatch => {
  return asyncAction(
    dispatch,
    types.PROJECT_LOAD_REQUEST,
    types.PROJECT_LOAD_SUCCESS,
    types.PROJECT_LOAD_FAILURE,
    async () => {
      const data = await loadProjectData(path);
      return {
        data,
        path
      };
    }
  );
};

export const loadSprite = filename => async (dispatch, getState) => {
  return asyncAction(
    dispatch,
    types.SPRITE_LOAD_REQUEST,
    types.SPRITE_LOAD_SUCCESS,
    types.SPRITE_LOAD_FAILURE,
    async () => {
      const state = getState();
      const projectRoot = state.document && state.document.root;
      const data = await loadSpriteData(projectRoot)(filename);
      return {
        data
      };
    }
  );
};

export const removeSprite = filename => async (dispatch, getState) => {
  const state = getState();
  const projectRoot = state.document && state.document.root;
  const relativePath = filename.replace(projectRoot, "");
  const plugin = relativePath.startsWith("/plugin")
    ? relativePath.replace(/\/plugins\/([^/]*)\/.*/, "$1")
    : undefined;
  const file = plugin
    ? relativePath.replace(`/plugins/${plugin}/sprites/`, "")
    : relativePath.replace("/assets/sprites/", "");
  return dispatch({
    type: types.SPRITE_REMOVE,
    data: {
      filename: file,
      plugin
    }
  });
};

export const loadBackground = filename => async (dispatch, getState) => {
  return asyncAction(
    dispatch,
    types.BACKGROUND_LOAD_REQUEST,
    types.BACKGROUND_LOAD_SUCCESS,
    types.BACKGROUND_LOAD_FAILURE,
    async () => {
      const state = getState();
      const projectRoot = state.document && state.document.root;
      const data = await loadBackgroundData(projectRoot)(filename);
      return {
        data
      };
    }
  );
};

export const removeBackground = filename => async (dispatch, getState) => {
  const state = getState();
  const projectRoot = state.document && state.document.root;
  const relativePath = filename.replace(projectRoot, "");
  const plugin = relativePath.startsWith("/plugin")
    ? relativePath.replace(/\/plugins\/([^/]*)\/.*/, "$1")
    : undefined;
  const file = plugin
    ? relativePath.replace(`/plugins/${plugin}/backgrounds/`, "")
    : relativePath.replace("/assets/backgrounds/", "");
  return dispatch({
    type: types.BACKGROUND_REMOVE,
    data: {
      filename: file,
      plugin
    }
  });
};

export const loadMusic = filename => async (dispatch, getState) => {
  return asyncAction(
    dispatch,
    types.MUSIC_LOAD_REQUEST,
    types.MUSIC_LOAD_SUCCESS,
    types.MUSIC_LOAD_FAILURE,
    async () => {
      const state = getState();
      const projectRoot = state.document && state.document.root;
      const data = await loadMusicData(projectRoot)(filename);
      return {
        data
      };
    }
  );
};

export const removeMusic = filename => async (dispatch, getState) => {
  const state = getState();
  const projectRoot = state.document && state.document.root;
  const relativePath = filename.replace(projectRoot, "");
  const plugin = relativePath.startsWith("/plugin")
    ? relativePath.replace(/\/plugins\/([^/]*)\/.*/, "$1")
    : undefined;
  const file = plugin
    ? relativePath.replace(`/plugins/${plugin}/music/`, "")
    : relativePath.replace("/assets/music/", "");
  return dispatch({
    type: types.MUSIC_REMOVE,
    data: {
      filename: file,
      plugin
    }
  });
};

export const playMusic = filename => {
  return {
    type: types.PLAY_MUSIC,
    filename
  };
};

export const pauseMusic = () => {
  return {
    type: types.PAUSE_MUSIC
  };
};

export const saveProject = () => async (dispatch, getState) => {
  const state = getState();
  if (!state.document.loaded || state.document.saving) {
    return;
  }
  await asyncAction(
    dispatch,
    types.PROJECT_SAVE_REQUEST,
    types.PROJECT_SAVE_SUCCESS,
    types.PROJECT_SAVE_FAILURE,
    async () => {
      await saveProjectData(state.document.path, {
        ...state.project.present,
        settings: {
          ...state.project.present.settings,
          zoom: state.editor.zoom
        }
      });
    }
  );
};

export const setTool = tool => {
  return { type: types.SET_TOOL, tool };
};

export const setActorPrefab = actor => {
  return { type: types.SET_ACTOR_PREFAB, actor };
};

export const setTriggerPrefab = trigger => {
  return { type: types.SET_TRIGGER_PREFAB, trigger };
};

export const setScenePrefab = scene => {
  return { type: types.SET_SCENE_PREFAB, scene };
};

export const setSection = section => {
  return { type: types.SET_SECTION, section };
};

export const setNavigationId = id => {
  return { type: types.SET_NAVIGATION_ID, id };
};

export const addScene = (x, y, defaults) => {
  return { type: types.ADD_SCENE, x, y, id: uuid(), defaults };
};

export const selectScene = sceneId => {
  return { type: types.SELECT_SCENE, sceneId };
};

export const moveScene = (sceneId, x, y) => {
  return { type: types.MOVE_SCENE, sceneId, x, y };
};

export const dragScene = (moveX, moveY) => {
  return { type: types.DRAG_SCENE, moveX, moveY };
};

export const dragSceneStart = () => {
  return { type: types.DRAG_SCENE_START };
};

export const dragSceneStop = () => {
  return { type: types.DRAG_SCENE_STOP };
};

export const editScene = (sceneId, values) => {
  return { type: types.EDIT_SCENE, sceneId, values };
};

export const removeScene = sceneId => {
  return { type: types.REMOVE_SCENE, sceneId };
};

export const addActor = (sceneId, x, y, defaults) => {
  return { type: types.ADD_ACTOR, sceneId, x, y, id: uuid(), defaults };
};

export const sceneHover = (sceneId, x, y) => {
  return { type: types.SCENE_HOVER, sceneId, x, y };
};

export const actorHover = (sceneId, id, x, y) => {
  return { type: types.ACTOR_HOVER, sceneId, id, x, y };
};

export const moveSelectedEntity = (sceneId, x, y) => (dispatch, getState) => {
  const state = getState();
  const { dragging, scene, eventId, entityId, type: editorType } = state.editor;
  if (dragging === DRAG_PLAYER) {
    dispatch(editPlayerStartAt(sceneId, x, y));
  } else if (dragging === DRAG_DESTINATION) {
    dispatch(
      editDestinationPosition(
        eventId,
        scene,
        editorType,
        entityId,
        sceneId,
        x,
        y
      )
    );
  } else if (dragging === DRAG_ACTOR) {
    dispatch(moveActor(scene, entityId, sceneId, x, y));
  } else if (dragging === DRAG_TRIGGER) {
    console.log("MOVE TRIGGER?", scene, entityId, sceneId, x, y);
    dispatch(moveTrigger(scene, entityId, sceneId, x, y));
  }
};

export const removeSelectedEntity = () => (dispatch, getState) => {
  const state = getState();
  const { scene, entityId, type: editorType } = state.editor;
  if (editorType === "scenes") {
    dispatch(removeScene(scene));
  } else if (editorType === "triggers") {
    dispatch(removeTrigger(scene, entityId));
  } else if (editorType === "actors") {
    dispatch(removeActor(scene, entityId));
  }
};

export const moveActor = (sceneId, id, newSceneId, x, y) => {
  return { type: types.MOVE_ACTOR, sceneId, id, newSceneId, x, y };
};

export const selectActor = (sceneId, id) => {
  return { type: types.SELECT_ACTOR, sceneId, id };
};

export const removeActor = (sceneId, id) => {
  return { type: types.REMOVE_ACTOR, sceneId, id };
};

export const removeActorAt = (sceneId, x, y) => {
  return { type: types.REMOVE_ACTOR_AT, sceneId, x, y };
};

export const editActor = (sceneId, id, values) => {
  return { type: types.EDIT_ACTOR, sceneId, id, values };
};

export const selectScriptEvent = eventId => {
  return { type: types.SELECT_SCRIPT_EVENT, eventId };
};

export const addCollisionTile = (sceneId, x, y) => {
  return { type: types.ADD_COLLISION_TILE, sceneId, x, y };
};

export const removeCollisionTile = (sceneId, x, y) => {
  return { type: types.REMOVE_COLLISION_TILE, sceneId, x, y };
};

export const addTrigger = (sceneId, x, y, defaults) => {
  return { type: types.ADD_TRIGGER, sceneId, x, y, id: uuid(), defaults };
};

export const removeTrigger = (sceneId, id) => {
  return { type: types.REMOVE_TRIGGER, sceneId, id };
};

export const removeTriggerAt = (sceneId, x, y) => {
  return { type: types.REMOVE_TRIGGER_AT, sceneId, x, y };
};

export const resizeTrigger = (sceneId, id, startX, startY, x, y) => {
  return { type: types.RESIZE_TRIGGER, sceneId, id, startX, startY, x, y };
};

export const moveTrigger = (sceneId, id, newSceneId, x, y) => {
  return { type: types.MOVE_TRIGGER, sceneId, id, newSceneId, x, y };
};

export const editTrigger = (sceneId, id, values) => {
  return { type: types.EDIT_TRIGGER, sceneId, id, values };
};

export const selectTrigger = (sceneId, id) => {
  return { type: types.SELECT_TRIGGER, sceneId, id };
};

export const renameVariable = (variableId, name) => {
  return { type: types.RENAME_VARIABLE, variableId, name };
};

export const setStatus = status => {
  return { type: types.SET_STATUS, status };
};

export const selectWorld = () => {
  return { type: types.SELECT_WORLD };
};

export const editWorld = values => {
  return { type: types.EDIT_WORLD, values };
};

export const editProject = values => {
  return { type: types.EDIT_PROJECT, values };
};

export const editProjectSettings = values => {
  return { type: types.EDIT_PROJECT_SETTINGS, values };
};

export const editPlayerStartAt = (sceneId, x, y) => {
  return { type: types.EDIT_PLAYER_START_AT, sceneId, x, y };
};

export const dragPlayerStart = () => {
  return { type: types.DRAG_PLAYER_START };
};

export const dragPlayerStop = () => {
  return { type: types.DRAG_PLAYER_STOP };
};

export const dragActorStart = (sceneId, id) => {
  return { type: types.DRAG_ACTOR_START, sceneId, id };
};

export const dragActorStop = () => {
  return { type: types.DRAG_ACTOR_STOP };
};

export const dragTriggerStart = (sceneId, id) => {
  return { type: types.DRAG_TRIGGER_START, sceneId, id };
};

export const dragTriggerStop = () => {
  return { type: types.DRAG_TRIGGER_STOP };
};

export const dragDestinationStart = (eventId, sceneId, selectionType, id) => {
  return {
    type: types.DRAG_DESTINATION_START,
    eventId,
    sceneId,
    selectionType,
    id
  };
};

export const editDestinationPosition = (
  eventId,
  sceneId,
  selectionType,
  id,
  destSceneId,
  x,
  y
) => {
  if (selectionType === "actors") {
    return {
      type: types.EDIT_ACTOR_EVENT_DESTINATION_POSITION,
      eventId,
      sceneId,
      id,
      destSceneId,
      x,
      y
    };
  }
  if (selectionType === "triggers") {
    return {
      type: types.EDIT_TRIGGER_EVENT_DESTINATION_POSITION,
      eventId,
      sceneId,
      id,
      destSceneId,
      x,
      y
    };
  }
  return {
    type: types.EDIT_SCENE_EVENT_DESTINATION_POSITION,
    eventId,
    sceneId,
    destSceneId,
    x,
    y
  };
};

export const dragDestinationStop = () => {
  return { type: types.DRAG_DESTINATION_STOP };
};

export const copyEvent = event => {
  return { type: types.COPY_EVENT, event };
};

export const copyActor = actor => {
  return { type: types.COPY_ACTOR, actor };
};

export const copyTrigger = trigger => {
  return { type: types.COPY_TRIGGER, trigger };
};

export const pasteActor = (sceneId, actor) => {
  return { type: types.PASTE_ACTOR, sceneId, actor, id: uuid() };
};

export const pasteTrigger = (sceneId, trigger) => {
  return { type: types.PASTE_TRIGGER, sceneId, trigger, id: uuid() };
};

export const pasteScene = scene => {
  return { type: types.PASTE_SCENE, scene, id: uuid() };
};

export const copyScene = scene => {
  return { type: types.COPY_SCENE, scene };
};

export const zoomIn = (section, delta) => {
  return { type: types.ZOOM_IN, section, delta };
};

export const zoomOut = (section, delta) => {
  return { type: types.ZOOM_OUT, section, delta };
};

export const zoomReset = section => {
  return { type: types.ZOOM_RESET, section };
};

export const editUI = () => {
  return { type: types.EDIT_UI };
};

export const openHelp = page => {
  return { type: types.OPEN_HELP, page };
};

export const openFolder = path => {
  return { type: types.OPEN_FOLDER, path };
};

export const consoleClear = () => {
  return { type: types.CMD_CLEAR };
};

export const buildGame = ({
  buildType = "web",
  exportBuild = false,
  ejectBuild = false
} = {}) => async (dispatch, getState) => {
  const state = getState();
  if (!state.document.loaded || state.console.status === "running") {
    // Can't build while previous build still in progress
    // or loading project
    return;
  }
  dispatch({
    type: types.BUILD_GAME,
    buildType,
    exportBuild,
    ejectBuild
  });
};
