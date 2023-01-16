export async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export async function sendMessageInCurrentTab(
  message: any,
  callback?: ((response: any) => void) | undefined
) {
  const tab = await getCurrentTab();
  if (!tab.id) return;
  return sendMessageInTab(tab.id, message, callback);
}

async function sendMessageInTab(
  tabId: number,
  message: any,
  callback?: ((response: any) => void) | undefined
) {
  chrome.tabs.sendMessage(tabId, message, callback);
}

export function decimalToColor(decimal: number): string {
  const red = Math.round(255 * (1 - decimal));
  const green = Math.round(255 * decimal);
  return `rgb(${red}, ${green}, 0)`;
}
