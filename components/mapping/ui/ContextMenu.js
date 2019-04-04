import { ContextMenu, MenuItem } from 'react-contextmenu';

export const id = 'canvas-context-menu';

export default () => {
  return (
    <ContextMenu id={id}>
      <MenuItem data={{ foo: 'bar' }} onClick={console.log}>
        ContextMenu Item 1
      </MenuItem>
      <MenuItem data={{ foo: 'bar' }} onClick={console.log}>
        ContextMenu Item 2
      </MenuItem>
      <MenuItem divider />
      <MenuItem data={{ foo: 'bar' }} onClick={console.log}>
        ContextMenu Item 3
      </MenuItem>
    </ContextMenu>
  );
};
