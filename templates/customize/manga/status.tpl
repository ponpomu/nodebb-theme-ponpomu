<div class="bar-stauts-cotainer" component="manhua" style="display: none;">
    
    <div class="prev-btn {{{ if !media.isPrev }}}invisible{{{ end }}}">
        <a href="">
            <i class="fa fa-xl fa-solid fa-backward-step rounded-1" data-label="Backward step (solid)"></i>
        </a>
    </div>
    
    <div class="progress-bar-container">
        <input type="range" min="1" max="100" value="1" class="slider" id="comic-page-slider">
        <div class="comic-page-count">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    
    <div class="next-btn {{{ if !media.isNext }}}invisible{{{ end }}}">
        <a href="">
            <i class="fa fa-xl fa-solid fa-forward-step rounded-1" data-label="Forward step (solid)"></i>
        </a>
    </div>
    
</div>