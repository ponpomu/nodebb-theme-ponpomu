{{{ if media.isNext }}}
<a href="" onclick="location.replace('./{function.calculator, media.index, " 1" , "+" }')">
    <div id="Bottom_filling" style="
        font-size: 2.5rem;
        height: 50vh;
        padding: auto auto;
        align-items: center;
        display: flex;
        justify-content: space-evenly;
        color: #fff;
        background-color: #ffffffb3;
    ">点击前往下一话</div>
</a>
{{{ else }}}
<div id="Bottom_filling" style="
        font-size: 2.5rem;
        height: 50vh;
        padding: auto auto;
        align-items: center;
        display: flex;
        justify-content: space-evenly;
        background-color: #3f3e3fb3;
    ">已经到尽头了</div>
{{{ end }}}

<style>
    .lazyload {
        opacity: 0;
        transform: scale(0.8);
        height: 100vh !important;
        width: 100vw !important;
    }
</style>