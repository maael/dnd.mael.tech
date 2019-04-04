import { ContextMenuTrigger } from 'react-contextmenu';
import Mapper from '../components/mapping/Mapper';
import { id as ContextMenuId } from '../components/mapping/ui/ContextMenu';

export default () => (
  <div style={{ flex: 1 }}>
    <ContextMenuTrigger id={ContextMenuId} holdToDisplay={-1}>
      <Mapper />
    </ContextMenuTrigger>
  </div>
);
