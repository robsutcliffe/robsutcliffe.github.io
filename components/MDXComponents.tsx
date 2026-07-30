import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import YouTube from './YouTube'
import FAQ from './FAQ'
import CtaButton from './CtaButton'
import Badge from './Badge'
import Offer from './Offer'
import BottomLine from './BottomLine'
import Matrix from './Matrix'
import Tabs from './Tabs'
import CostGrid from './CostGrid'
import Checklist from './Checklist'
import DualChecklist from './DualChecklist'
import Process from './Process'
import HighlightBox from './HighlightBox'
import KeyTakeaways from './KeyTakeaways'
import { SvgScatterPlot, SvgScatterPlotPair } from './blog/Plot'
import { SvgScatterPlot3D } from './blog/Plot3D'
import { SvgScreePlot } from './blog/ScreePlot'
import Project from './Project'

export const components: any = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: (props) => (
    <TableWrapper>
      <table className="border-collapse text-left" {...props} />
    </TableWrapper>
  ),
  TableWrapper,
  BlogNewsletterForm,
  YouTube,
  FAQ,
  CtaButton,
  Badge,
  Offer,
  BottomLine,
  Matrix,
  Tabs,
  CostGrid,
  Checklist,
  DualChecklist,
  Process,
  HighlightBox,
  KeyTakeaways,
  SvgScatterPlot,
  SvgScatterPlotPair,
  SvgScatterPlot3D,
  SvgScreePlot,
  Project,
}
