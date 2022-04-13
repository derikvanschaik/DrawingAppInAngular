import Line from './Line'

export default interface Tab{
    title: string,  
    lines: Line[],
    curLineIdx: number, // 
}