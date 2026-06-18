import type {ReactNode, SVGProps} from 'react';

import { IonIcon } from '@ionic/react';
import { logoGitlab } from 'ionicons/icons';


export default function GitLab(props: SVGProps<SVGSVGElement>): ReactNode {
  return <IonIcon icon={logoGitlab} {...props} style={{color: '#FCA326'}}/>;
}
