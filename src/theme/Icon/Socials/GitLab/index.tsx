import type {ReactNode, SVGProps} from 'react';

import { IonIcon } from '@ionic/react';
import { logoGitlab } from 'ionicons/icons';


// Keeps the SVGProps signature of the other social icons, but IonIcon isn't an <svg>: spreading every SVG
// attribute onto it clashes with Ionic's own props (e.g. `mode`). Callers only pass className.
export default function GitLab({className}: SVGProps<SVGSVGElement>): ReactNode {
  return <IonIcon icon={logoGitlab} className={className} style={{color: '#FCA326'}}/>;
}
