/**
 * Actions represent the type of change to a location value.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#action
 */
export enum Action {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Pop = "POP",

  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Push = "PUSH",

  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Replace = "REPLACE",
}

/**
 * A URL pathname, beginning with a /.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.pathname
 */
export type Pathname = string;

/**
 * A URL search string, beginning with a ?.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.search
 */
export type Search = string;

/**
 * A URL fragment identifier, beginning with a #.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.hash
 */
export type Hash = string;

/**
 * An object that is used to associate some arbitrary data with a location, but
 * that does not appear in the URL path.
 *
 * @deprecated
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.state
 */
export type State = unknown;

/**
 * A unique string associated with a location. May be used to safely store
 * and retrieve data in some other storage API, like `localStorage`.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.key
 */
export type Key = string;

/**
 * The pathname, search, and hash values of a URL.
 */
export interface Path {
  /**
   * A URL pathname, beginning with a /.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.pathname
   */
  pathname: Pathname;

  /**
   * A URL search string, beginning with a ?.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.search
   */
  search: Search;

  /**
   * A URL fragment identifier, beginning with a #.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.hash
   */
  hash: Hash;
}

/**
 * An entry in a history stack. A location contains information about the
 * URL path, as well as possibly some arbitrary state and a key.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location
 */
export interface Location extends Path {
  /**
   * A value of arbitrary data associated with this location.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.state
   */
  state: unknown;

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.key
   */
  key: Key;
}

/**
 * A partial Path object that may be missing some properties.
 *
 * @deprecated
 */
export type PartialPath = Partial<Path>;

/**
 * A partial Location object that may be missing some properties.
 *
 * @deprecated
 */
export type PartialLocation = Partial<Location>;

/**
 * A change to the current location.
 */
export interface Update {
  /**
   * The action that triggered the change.
   */
  action: Action;

  /**
   * The new location.
   */
  location: Location;
}

/**
 * A function that receives notifications about location changes.
 */
export interface Listener {
  (update: Update): void;
}

/**
 * A change to the current location that was blocked. May be retried
 * after obtaining user confirmation.
 */
export interface Transition extends Update {
  /**
   * Retries the update to the current location.
   */
  retry(): void;
}

/**
 * A function that receives transitions when navigation is blocked.
 */
export interface Blocker {
  (tx: Transition): void;
}

/**
 * Describes a location that is the destination of some navigation, either via
 * `history.push` or `history.replace`. May be either a URL or the pieces of a
 * URL path.
 */
export type To = string | Partial<Path>;

/**
 * A history is an interface to the navigation stack. The history serves as the
 * source of truth for the current location, as well as provides a set of
 * methods that may be used to change it.
 *
 * It is similar to the DOM's `window.history` object, but with a smaller, more
 * focused API.
 */
export interface History {
  /**
   * The last action that modified the current location. This will always be
   * Action.Pop when a history instance is first created. This value is mutable.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.action
   */
  readonly action: Action;

  /**
   * The current location. This value is mutable.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.location
   */
  readonly location: Location;

  /**
   * Returns a valid href for the given `to` value that may be used as
   * the value of an <a href> attribute.
   *
   * @param to - The destination URL
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.createHref
   */
  createHref(to: To): string;

  /**
   * Pushes a new location onto the history stack, increasing its length by one.
   * If there were any entries in the stack after the current one, they are
   * lost.
   *
   * @param to - The new URL
   * @param state - Data to associate with the new location
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.push
   */
  push(to: To, state?: any): void;

  /**
   * Replaces the current location in the history stack with a new one.  The
   * location that was replaced will no longer be available.
   *
   * @param to - The new URL
   * @param state - Data to associate with the new location
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.replace
   */
  replace(to: To, state?: any): void;

  /**
   * Navigates `n` entries backward/forward in the history stack relative to the
   * current index. For example, a "back" navigation would use go(-1).
   *
   * @param delta - The delta in the stack index
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.go
   */
  go(delta: number): void;

  /**
   * Navigates to the previous entry in the stack. Identical to go(-1).
   *
   * Warning: if the current location is the first location in the stack, this
   * will unload the current document.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.back
   */
  back(): void;

  /**
   * Navigates to the next entry in the stack. Identical to go(1).
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.forward
   */
  forward(): void;

  /**
   * Sets up a listener that will be called whenever the current location
   * changes.
   *
   * @param listener - A function that will be called when the location changes
   * @returns unlisten - A function that may be used to stop listening
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.listen
   */
  listen(listener: Listener): () => void;

  /**
   * Prevents the current location from changing and sets up a listener that
   * will be called instead.
   *
   * @param blocker - A function that will be called when a transition is blocked
   * @returns unblock - A function that may be used to stop blocking
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.block
   */
  block(blocker: Blocker): () => void;
}

/**
 * A browser history stores the current location in regular URLs in a web
 * browser environment. This is the standard for most web apps and provides the
 * cleanest URLs the browser's address bar.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#browserhistory
 */
export interface BrowserHistory extends History {}

/**
 * A hash history stores the current location in the fragment identifier portion
 * of the URL in a web browser environment.
 *
 * This is ideal for apps that do not control the server for some reason
 * (because the fragment identifier is never sent to the server), including some
 * shared hosting environments that do not provide fine-grained controls over
 * which pages are served at which URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#hashhistory
 */
export interface HashHistory extends History {}

/**
 * A memory history stores locations in memory. This is useful in stateful
 * environments where there is no web browser, such as node tests or React
 * Native.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#memoryhistory
 */
export interface MemoryHistory extends History {
  readonly index: number;
}

const readOnly: <T>(obj: T) => Readonly<T> = __DEV__
  ? (obj) => Object.freeze(obj)
  : (obj) => obj;

function warning(cond: any, message: string) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);

    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

////////////////////////////////////////////////////////////////////////////////
// BROWSER
////////////////////////////////////////////////////////////////////////////////

type HistoryState = {
  usr: any;
  key?: string;
  idx: number;
};

const BeforeUnloadEventType = "beforeunload";
const HashChangeEventType = "hashchange";
const PopStateEventType = "popstate";

export type BrowserHistoryOptions = { window?: Window };

/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 */
export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  let { window = document.defaultView! } = options;
  let globalHistory = window.history;

  function getIndexAndLocation(): [number, Location] {
    let { pathname, search, hash } = window.location;
    let state = globalHistory.state || {};
    return [
      state.idx,
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || "default",
      }),
    ];
  }

  let blockedPopTx: Transition | null = null;
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      let nextAction = Action.Pop;
      let [nextIndex, nextLocation] = getIndexAndLocation();

      if (blockers.length) {
        if (nextIndex != null) {
          let delta = index - nextIndex;
          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                go(delta * -1);
              },
            };

            go(delta);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better what
            // is going on and how to avoid it.
            `You are trying to block a POP navigation to a location that was not ` +
              `created by the history library. The block will fail silently in ` +
              `production, but in general you should do all navigation with the ` +
              `history library (instead of using window.history.pushState directly) ` +
              `to avoid this situation.`
          );
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop);

  let action = Action.Pop;
  let [index, location] = getIndexAndLocation();
  let listeners = createEvents<Listener>();
  let blockers = createEvents<Blocker>();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }

  function createHref(to: To) {
    return typeof to === "string" ? to : createPath(to);
  }

  // state defaults to `null` because `window.history.state` does
  function getNextLocation(to: To, state: any = null): Location {
    return readOnly<Location>({
      pathname: location.pathname,
      hash: "",
      search: "",
      ...(typeof to === "string" ? parsePath(to) : to),
      state,
      key: createKey(),
    });
  }

  function getHistoryStateAndUrl(
    nextLocation: Location,
    index: number
  ): [HistoryState, string] {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index,
      },
      createHref(nextLocation),
    ];
  }

  function allowTx(action: Action, location: Location, retry: () => void) {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction: Action) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  function push(to: To, state?: any) {
    let nextAction = Action.Push;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to: To, state?: any) {
    let nextAction = Action.Replace;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, "", url);

      applyTx(nextAction);
    }
  }

  function go(delta: number) {
    globalHistory.go(delta);
  }

  let history: BrowserHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {
      let unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function () {
        unblock();

        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    },
  };

  return history;
}

////////////////////////////////////////////////////////////////////////////////
// HASH
////////////////////////////////////////////////////////////////////////////////

export type HashHistoryOptions = { window?: Window };

/**
 * Hash history stores the location in window.location.hash. This makes it ideal
 * for situations where you don't want to send the location to the server for
 * some reason, either because you do cannot configure it or the URL space is
 * reserved for something else.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
 */
export function createHashHistory(
  options: HashHistoryOptions = {}
): HashHistory {

  // window 默认为 document.defaultView
  let { window = document.defaultView! } = options;
  let globalHistory = window.history;

  /**
   * 获取 index 和 location
   * @returns [index:在历史栈中的第几个,location]
   */
  function getIndexAndLocation(): [number, Location] {
    let {
      pathname = "/",
      search = "",
      hash = "",
    } = parsePath(window.location.hash.substr(1));
    let state = globalHistory.state || {};
    return [
      state.idx,
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || "default",
      }),
    ];
  }

  let blockedPopTx: Transition | null = null;
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      let nextAction = Action.Pop;
      let [nextIndex, nextLocation] = getIndexAndLocation();

      if (blockers.length) {
        if (nextIndex != null) {
          let delta = index - nextIndex;
          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                go(delta * -1);
              },
            };

            go(delta);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better
            // what is going on and how to avoid it.
            `You are trying to block a POP navigation to a location that was not ` +
              `created by the history library. The block will fail silently in ` +
              `production, but in general you should do all navigation with the ` +
              `history library (instead of using window.history.pushState directly) ` +
              `to avoid this situation.`
          );
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop);

  // popstate does not fire on hashchange in IE 11 and old (trident) Edge
  // https://developer.mozilla.org/de/docs/Web/API/Window/popstate_event
  window.addEventListener(HashChangeEventType, () => {
    let [, nextLocation] = getIndexAndLocation();

    // Ignore extraneous hashchange events.
    if (createPath(nextLocation) !== createPath(location)) {
      handlePop();
    }
  });

  let action = Action.Pop;
  let [index, location] = getIndexAndLocation();
  let listeners = createEvents<Listener>();
  let blockers = createEvents<Blocker>();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }

  function getBaseHref() {
    let base = document.querySelector("base");
    let href = "";

    if (base && base.getAttribute("href")) {
      let url = window.location.href;
      let hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    return href;
  }

  function createHref(to: To) {
    return getBaseHref() + "#" + (typeof to === "string" ? to : createPath(to));
  }

  // 把传入的 location 解析为 Location 对象（push 和 replace 时）
  function getNextLocation(to: To, state: any = null): Location {
    return readOnly<Location>({
      pathname: location.pathname,
      hash: "",
      search: "",
      ...(typeof to === "string" ? parsePath(to) : to),
      state,
      key: createKey(),
    });
  }

  function getHistoryStateAndUrl(
    nextLocation: Location,
    index: number
  ): [HistoryState, string] {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index,
      },
      createHref(nextLocation),
    ];
  }

  // 判断是否允许跳转
  function allowTx(action: Action, location: Location, retry: () => void) {
    return (
      // 如果没有注册函数则直接判定 true
      // 如果有注册函数，则依次调用注册函数并判定 false
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  // 在执行跳转时执行 listeners 中注册的回调函数
  function applyTx(nextAction: Action) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  /**
   * 把新的历史条目添加到历史栈上
   * @param to 
   * @param state 
   */
  function push(to: To, state?: any) {
    let nextAction = Action.Push;
    // 生成下一个 Location
    let nextLocation = getNextLocation(to, state);
    // 用于重试
    function retry() {
      push(to, state);
    }

    warning(
      nextLocation.pathname.charAt(0) === "/",
      `Relative pathnames are not supported in hash history.push(${JSON.stringify(
        to
      )})`
    );

    // 与 history.block 相关
    if (allowTx(nextAction, nextLocation, retry)) {
      // 根据新的 Location 生成新的 historyState 和 url
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

      // TODO: Support forced reloading
      // 官方注释：用 try...catch 包裹是因为 IOS 中限制 pushState 的调用次数为 100 次
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error) {
        // 刷新页面，等于 window.location.href = url
        // 官方注释：这样会失去 state，但是没有有效的方法警告他们，因为页面会刷新
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      // 执行 listeners 中注册的回调函数
      applyTx(nextAction);
    }
  }

  /**
   * 讲当前历史栈中的历史条目替换成新的历史条目
   * 与 push 基本相同，仅仅是 index 不自增、调用了不同的 windows.history 的原生 API
   * @param to 
   * @param state 
   */
  function replace(to: To, state?: any) {
    let nextAction = Action.Replace;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    warning(
      nextLocation.pathname.charAt(0) === "/",
      `Relative pathnames are not supported in hash history.replace(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, "", url);

      applyTx(nextAction);
    }
  }

  function go(delta: number) {
    globalHistory.go(delta);
  }

  let history: HashHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    /**
     * 向 blockers 注册一个回调函数
     * 官方文档：Prevents changes to the history stack from happening. This is useful
     *  when you want to prevent the user navigating away from the current page,
     *  for example when they have some unsaved data on the current page.
     * @param blocker {(tx: Transition): void}
     * @returns 
     */
    block(blocker:Blocker) {
      // 向 blockers 注册一个回调函数
      let unblock = blockers.push(blocker);

      // 如果 blockers 中有注册的回调函数，就阻止默认操作。
      /**
       * 监听'beforeunload'事件（在浏览器关闭或刷新页面时触发）并且调用 
       *  event.preventDefault() 会弹出弹窗,而且这个阻塞事件是不可以自定义的
       *  也就是说，传入的形参 blocker 对于阻塞交互没有影响，只会影响
       *  push, replace, go 这些 history 库中用于改变当前路由的 API。
       */

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function () {
        // 移除事件监听
        unblock();
        
        // 官方注释：移除 beforeunload 事件监听，可以让页面文档 document 在 pagehide 事件中是可以会回收的
        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    },
  };

  return history;
}

////////////////////////////////////////////////////////////////////////////////
// MEMORY
////////////////////////////////////////////////////////////////////////////////

/**
 * A user-supplied object that describes a location. Used when providing
 * entries to `createMemoryHistory` via its `initialEntries` option.
 */
export type InitialEntry = string | Partial<Location>;

export type MemoryHistoryOptions = {
  initialEntries?: InitialEntry[];
  initialIndex?: number;
};

/**
 * Memory history stores the current location in memory. It is designed for use
 * in stateful non-browser environments like tests and React Native.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#creatememoryhistory
 */
export function createMemoryHistory(
  options: MemoryHistoryOptions = {}
): MemoryHistory {
  let { initialEntries = ["/"], initialIndex } = options;
  let entries: Location[] = initialEntries.map((entry) => {
    let location = readOnly<Location>({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: createKey(),
      ...(typeof entry === "string" ? parsePath(entry) : entry),
    });

    warning(
      location.pathname.charAt(0) === "/",
      `Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: ${JSON.stringify(
        entry
      )})`
    );

    return location;
  });
  let index = clamp(
    initialIndex == null ? entries.length - 1 : initialIndex,
    0,
    entries.length - 1
  );

  let action = Action.Pop;
  let location = entries[index];
  let listeners = createEvents<Listener>();
  let blockers = createEvents<Blocker>();

  function createHref(to: To) {
    return typeof to === "string" ? to : createPath(to);
  }

  function getNextLocation(to: To, state: any = null): Location {
    return readOnly<Location>({
      pathname: location.pathname,
      search: "",
      hash: "",
      ...(typeof to === "string" ? parsePath(to) : to),
      state,
      key: createKey(),
    });
  }

  function allowTx(action: Action, location: Location, retry: () => void) {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction: Action, nextLocation: Location) {
    action = nextAction;
    location = nextLocation;
    listeners.call({ action, location });
  }

  function push(to: To, state?: any) {
    let nextAction = Action.Push;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }

    warning(
      location.pathname.charAt(0) === "/",
      `Relative pathnames are not supported in memory history.push(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      applyTx(nextAction, nextLocation);
    }
  }

  function replace(to: To, state?: any) {
    let nextAction = Action.Replace;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    warning(
      location.pathname.charAt(0) === "/",
      `Relative pathnames are not supported in memory history.replace(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  }

  function go(delta: number) {
    let nextIndex = clamp(index + delta, 0, entries.length - 1);
    let nextAction = Action.Pop;
    let nextLocation = entries[nextIndex];
    function retry() {
      go(delta);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  }

  let history: MemoryHistory = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {
      return blockers.push(blocker);
    },
  };

  return history;
}

////////////////////////////////////////////////////////////////////////////////
// UTILS
////////////////////////////////////////////////////////////////////////////////

function clamp(n: number, lowerBound: number, upperBound: number) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}

function promptBeforeUnload(event: BeforeUnloadEvent) {
  // Cancel the event.
  event.preventDefault();
  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = "";
}

type Events<F> = {
  length: number;
  push: (fn: F) => () => void;
  call: (arg: any) => void;
};

// 创建一个基于观察者模式的 事件发布者
function createEvents<F extends Function>(): Events<F> {
  let handlers: F[] = [];

  return {
    get length() {
      return handlers.length;
    },
    // 用于注册订阅的函数，返回一个取消订阅的函数
    push(fn: F) {
      handlers.push(fn);
      return function () {
        handlers = handlers.filter((handler) => handler !== fn);
      };
    },
    // 触发事件（调用所有注册的方法）
    call(arg) {
      handlers.forEach((fn) => fn && fn(arg));
    },
  };
}

function createKey() {
  return Math.random().toString(36).substr(2, 8);
}

/**
 * Creates a string URL path from the given pathname, search, and hash components.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createpath
 */
export function createPath({
  pathname = "/",
  search = "",
  hash = "",
}: Partial<Path>) {
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}

/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#parsepath
 */
export function parsePath(path: string): Partial<Path> {
  let parsedPath: Partial<Path> = {};

  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    if (path) {
      parsedPath.pathname = path;
    }
  }

  return parsedPath;
}
