import React, { Component, Fragment } from 'react';
import EmojiPicker from '../EmojiPicker/EmojiPicker';
import { init, exec } from 'pell';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import GifOutlinedIcon from '@material-ui/icons/GifOutlined';
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

import 'pell/dist/pell.css';
import './Editor.css';
import Button from '../Button/Button';
import { appName } from '../../appName';

function placeCaretAtEnd(el, content) {
	el.querySelector('.pell-content').focus();
}

function getNodeIndex(n) {
	var i = 0;
	while ((n = n.previousSibling)) i++;
	return i;
}

function saveRangePosition(el) {
	var range = window.getSelection().getRangeAt(0);
	var sC = range.startContainer,
		eC = range.endContainer;

	const A = [];
	while (sC !== el) {
		A.push(getNodeIndex(sC));
		sC = sC.parentNode;
	}

	const B = [];
	while (eC !== el) {
		B.push(getNodeIndex(eC));
		eC = eC.parentNode;
	}

	return { sC: A, sO: range.startOffset, eC: B, eO: range.endOffset };
}

function restoreRangePosition(el, rp) {
	el.focus();
	var sel = window.getSelection(),
		range = sel.getRangeAt(0);
	var x,
		C,
		sC = el,
		eC = el;

	C = rp.sC;
	x = C.length;
	while (x--) sC = sC.childNodes[C[x]];
	C = rp.eC;
	x = C.length;
	while (x--) eC = eC.childNodes[C[x]];

	range.setStart(sC, rp.sO);
	range.setEnd(eC, rp.eO);
	sel.removeAllRanges();
	sel.addRange(range);
}

class Editor extends Component {
	state = {
		files: [],
	};

	editor = null;
	id = Date.now();

	componentDidMount() {
		const { html: htmlProp, onChange } = this.props;

		this.editor = init({
			element: document.getElementById(this.id),
			onChange: (html) => {
				if (onChange) {
					onChange(html);
				}
			},
			actions: [],
			defaultParagraphSeparator: 'div',
		});

		this.editor.content = { innerHTML: htmlProp };
	}

	componentDidUpdate() {
		if (this.props.html === '') {
			document.querySelector('.pell-content').innerHTML = '';
		}
	}

	handleClick = (event) => {
		if (this.node && !this.node.contains(event.target)) {
			this.props.closeEmojiPicker();
		}
	};

	handleEmojiClick = (n, e) => {
		let emoji = `<span><img class="emoji emoji-sizer" src="https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/${e.unified}.png" data-codepoints="${e.unified}"/></span>`;
		if (this.pos) {
			restoreRangePosition(this.editor, this.pos);
			exec('insertHTML', emoji);
			this.getPos();
		} else {
			placeCaretAtEnd(this.editor, this.editor.content);
			exec('insertHTML', emoji);
		}
	};

	getPos = () => {
		const pos = saveRangePosition(this.editor);
		this.pos = pos;
	};

	render() {
		let imagesDiv = null;
		if (this.props.images.length > 0) {
			imagesDiv = (
				<div className="NewPostImagesPreview">
					{this.props.images.map((f, i) => {
						return (
							<div
								key={i}
								style={{
									height: this.props.images.length < 3 ? '100%' : '50%',
									width:
										this.props.images.length === 4 ||
										this.props.images.length === 2
											? '50%'
											: this.props.images.length === 1
											? '100%'
											: i !== 2
											? '50%'
											: '100%',
								}}
								className={'ImageDiv'}
							>
								<CloseOutlinedIcon
									className="RemoveImageIcon"
									onClick={this.props.removeImage.bind(null, i)}
								/>
								<img src={URL.createObjectURL(f)} alt="ImagePreview" />
							</div>
						);
					})}
				</div>
			);
		}

		return (
			<Fragment>
				<div
					id={this.id}
					className={'pell Editor'}
					onKeyUp={this.getPos}
					onClick={this.getPos}
				></div>
				{imagesDiv}

				<div className="PostAction">
					<label htmlFor="postImages">
						<WallpaperIcon className="Icon" />
					</label>
					<input
						type="file"
						className="NewPostImagePicker"
						id="postImages"
						name="postImages"
						alt="Image Input"
						onChange={this.props.onImageChange}
						accept="image/*"
						multiple
					/>

					<GifOutlinedIcon className="Icon" />
					<BarChartOutlinedIcon className="Icon" />
					<SentimentSatisfiedOutlinedIcon
						className="Icon"
						onMouseDown={this.props.onToggleEmojiPicker}
					/>
					<DateRangeOutlinedIcon className="Icon" />

					<Button
						fontSize={1}
						disabled={this.props.html.length === 0}
						onClick={this.props.onPost}
					>
						{appName}
					</Button>
					{this.props.showEmojiPicker ? (
						<EmojiPicker
							closeEmojiPicker={this.props.closeEmojiPicker}
							handleEmojiClick={this.handleEmojiClick}
						/>
					) : null}
				</div>
			</Fragment>
		);
	}
}

export default Editor;
